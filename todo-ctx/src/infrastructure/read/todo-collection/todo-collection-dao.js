// @flow

import type { Connection } from 'mysql';
import {
    Todo,
    TodoCollectionDAO as ITodoCollectionDAO,
    TodoCollection
} from '../../../domain/read/todo-collection';

export default class TodoCollectionDAO implements ITodoCollectionDAO {
    _connection: Connection;

    constructor(connection: Connection) {
        this._connection = connection;
    }

    _toTodoCollection(row: Object): TodoCollection {
        const data = JSON.parse(row.todo_collection);

        const todos = data.todos.map(todoData =>
            Todo.create(todoData.id, todoData.name, todoData.isCompleted)
        );

        return TodoCollection.create(data.id, data.name, todos);
    }

    findById(id: string): Promise<?TodoCollection> {
        return new Promise((resolve, reject) => {
            this._connection.query(
                'SELECT todo_collection FROM read_todo_collection WHERE id = ?',
                [id],
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

    _toJSON(todoCollection: TodoCollection): string {
        return JSON.stringify({
            id: todoCollection.id,
            name: todoCollection.name,
            todos: todoCollection.todos.map(todo => ({
                id: todo.id,
                name: todo.name,
                isCompleted: todo.isCompleted
            }))
        });
    }

    persist(todoCollection: TodoCollection): Promise<void> {
        const data = {
            id: todoCollection.id,
            todo_collection: this._toJSON(todoCollection)
        };

        return new Promise((resolve, reject) => {
            this._connection.query(
                'INSERT INTO read_todo_collection SET ?',
                data,
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

    update(todoCollection: TodoCollection): Promise<void> {
        const data = {
            todo_collection: this._toJSON(todoCollection)
        };

        const id = todoCollection.id;

        return new Promise((resolve, reject) => {
            this._connection.query(
                'UPDATE read_todo_collection SET ? WHERE id = ?',
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
}
