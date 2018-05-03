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

    _findTodoCollectionDataById(
        id: string
    ): Promise<?{ id: string, name: string, todos: Array<string> }> {
        return new Promise((resolve, reject) => {
            this._connection.query(
                'SELECT * FROM todo_collection WHERE id = ?',
                [id],
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (result.length === 0) {
                        resolve();
                        return;
                    }

                    resolve({
                        id: result[0].id,
                        name: result[0].name,
                        todos: JSON.parse(result[0].todos) || []
                    });
                }
            );
        });
    }

    _findTodosForIds(ids: Array<string>): Promise<Array<Todo>> {
        if (ids.length === 0) return Promise.resolve([]);

        return new Promise((resolve, reject) => {
            this._connection.query(
                'SELECT * FROM todo WHERE id IN (?) ORDER BY sequence_id ASC',
                [ids],
                (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (results.length === 0) {
                        resolve([]);
                        return;
                    }

                    const todos = results.map(row => {
                        return Todo.create(row.id, row.name, !!row.is_completed);
                    });

                    resolve(todos);
                }
            );
        });
    }

    findById(id: string): Promise<?TodoCollection> {
        return this._findTodoCollectionDataById(id).then(todoCollectionData => {
            if (!todoCollectionData) return null;

            return this._findTodosForIds(todoCollectionData.todos).then(todos => {
                return TodoCollection.create(todoCollectionData.id, todoCollectionData.name, todos);
            });
        });
    }

    _todoToJSON(todo: Todo) {
        return [todo.id, todo.name, todo.isCompleted];
    }

    _todoCollectionToJSON(todoCollection: TodoCollection) {
        return {
            id: todoCollection.id,
            name: todoCollection.name,
            todos: JSON.stringify(todoCollection.todos.map(todo => todo.id))
        };
    }

    _persistTodos(todos: Array<Todo>): Promise<void> {
        if (todos.length === 0) return Promise.resolve();

        const data = todos.map(todo => this._todoToJSON(todo));

        return new Promise((resolve, reject) => {
            this._connection.query(
                'INSERT INTO todo (id, name, is_completed) VALUES ?',
                [data],
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

    _persistTodoCollection(todoCollection: TodoCollection): Promise<void> {
        const data = this._todoCollectionToJSON(todoCollection);

        return new Promise((resolve, reject) => {
            this._connection.query('INSERT INTO todo_collection SET ?', data, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    persist(todoCollection: TodoCollection): Promise<void> {
        return this._persistTodos(todoCollection.todos).then(() => {
            return this._persistTodoCollection(todoCollection);
        });
    }
}
