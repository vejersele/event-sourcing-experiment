// @flow

import type Todo from './todo';

export default class TodoCollection {
    _id: string;
    _name: string;
    _todos: Array<Todo>;

    constructor(id: string, name: string, todos?: Array<Todo> = []) {
        this._id = id;
        this._name = name;
        this._todos = todos;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get todos(): Array<Todo> {
        return this._todos;
    }

    static create(id: string, name: string, todos?: Array<Todo>) {
        return new TodoCollection(id, name, todos);
    }
}
