// @flow

import type TodoId from './todo-id';

export default class Todo {
    _id: TodoId;
    _name: string;
    _isCompleted: boolean;

    constructor(id: TodoId, name: string, isCompleted: boolean = false) {
        this._id = id;
        this._name = name;
        this._isCompleted = isCompleted;
    }

    get id(): TodoId {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string): void {
        if (name === '') throw new Error('Invalid name');

        this._name = name;
    }

    get isCompleted(): boolean {
        return this._isCompleted;
    }

    markAsCompleted() {
        this._isCompleted = true;
    }

    markAsUncompleted() {
        this._isCompleted = false;
    }

    static create(id: TodoId, name: string): Todo {
        return new Todo(id, name);
    }
}
