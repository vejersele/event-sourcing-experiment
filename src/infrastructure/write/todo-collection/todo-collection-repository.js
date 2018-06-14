// @flow

import type { EventBus } from '../../../domain/event-bus';

import { Connection } from 'mysql';
import { TodoCollectionPersisted } from '../../../domain/events/index';
import {
    type TodoCollectionRepository as ITodoCollectionRepository,
    TodoCollection,
    TodoCollectionId
} from '../../../domain/write/todo-collection';

export default class TodoCollectionRepository implements ITodoCollectionRepository {
    _connection: Connection;
    _eventBus: EventBus;

    constructor(connection: Connection, eventBus: EventBus) {
        this._connection = connection;
        this._eventBus = eventBus;
    }

    _todoCollectionToJSON(todoCollection: TodoCollection) {
        return {
            id: todoCollection.id.value,
            name: todoCollection.name
        };
    }

    _toTodoCollection(row: Object): TodoCollection {
        const id = TodoCollectionId.from(row.id);
        return new TodoCollection(id, row.name);
    }

    persist(todoCollection: TodoCollection): Promise<void> {
        const data = this._todoCollectionToJSON(todoCollection);

        return new Promise((resolve, reject) => {
            this._connection.query(
                'INSERT INTO write_todo_collection SET ?',
                data,
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                }
            );
        }).then(() => {
            this._eventBus.publish(
                new TodoCollectionPersisted(todoCollection.id.value, todoCollection.name)
            );
        });
    }

    update(todoCollection: TodoCollection): Promise<void> {
        const data = this._todoCollectionToJSON(todoCollection);
        const id = todoCollection.id.value;

        return new Promise((resolve, reject) => {
            this._connection.query(
                'UPDATE write_todo_collection SET ? WHERE id = ?',
                [data, id],
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

    findById(id: TodoCollectionId): Promise<?TodoCollection> {
        return new Promise((resolve, reject) => {
            this._connection.query(
                'SELECT * FROM write_todo_collection WHERE id = ?',
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

                    const todoCollection = this._toTodoCollection(results[0]);
                    resolve(todoCollection);
                }
            );
        });
    }
}
