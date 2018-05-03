// @flow

import type TodoCollectionId from './todo-collection-id';

export default class TodoCollection {
    _id: TodoCollectionId;
    _name: string;
    _isDeleted: boolean;
    _todoIds: Array<string>;

    constructor(id: TodoCollectionId, name: string, todoIds: Array<string> = []) {
        this._id = id;
        this._name = name;
        this._isDeleted = false;
        this._todoIds = todoIds;
    }

    get id(): TodoCollectionId {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get isDeleted(): boolean {
        return this._isDeleted;
    }

    get todos(): Array<string> {
        return this._todoIds;
    }

    addTodo(id: string) {
        this._todoIds = [...this._todoIds, id];
    }

    static create(id: TodoCollectionId, name: string) {
        return new TodoCollection(id, name);
    }
}
