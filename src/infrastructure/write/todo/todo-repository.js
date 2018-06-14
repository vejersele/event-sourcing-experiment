// @flow

import type { Connection } from 'mysql';
import TodoCollectionPersisted from '../../../domain/events/todo-collection-persisted';
import { TodoCollectionId as CollectionId } from '../../../domain/write/todo-collection/index';
import { Todo, TodoId, TodoRepository as ITodoRepository } from '../../../domain/write/todo';

export default class TodoRepository implements ITodoRepository {
    _connection: Connection;

    constructor(connection: Connection) {
        this._connection = connection;
    }

    _toTodo(row: Object) {
        return new Todo(
            TodoId.from(row.id),
            row.name,
            CollectionId.from(row.collection_id),
            !!row.is_completed
        );
    }

    _todoToJSON(todo: Todo) {
        return {
            id: todo.id.value,
            name: todo.name,
            is_completed: todo.isCompleted,
            collection_id: todo.collectionId.value
        };
    }

    persist(todo: Todo): Promise<void> {
        const data = this._todoToJSON(todo);

        return new Promise((resolve, reject) => {
            this._connection.query('INSERT INTO write_todo SET ?', data, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    update(todo: Todo): Promise<void> {
        const data = this._todoToJSON(todo);

        return new Promise((resolve, reject) => {
            this._connection.query(
                'UPDATE write_todo SET ? WHERE id = ?',
                [data, data.id],
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve();
                }
            );
        });
    }

    findById(id: TodoId): Promise<?Todo> {
        return new Promise((resolve, reject) => {
            this._connection.query(
                'SELECT * FROM write_todo WHERE id = ?',
                [id.value],
                (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (results.length === 0) {
                        resolve();
                        return;
                    }

                    const todo = this._toTodo(results[0]);
                    resolve(todo);
                }
            );
        });
    }
}
