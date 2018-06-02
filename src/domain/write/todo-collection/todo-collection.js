// @flow

import type TodoCollectionId from './todo-collection-id';

export default class TodoCollection {
    _id: TodoCollectionId;
    _name: string;

    constructor(id: TodoCollectionId, name: string) {
        this._id = id;
        this._name = name;
    }

    get id(): TodoCollectionId {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    static create(id: TodoCollectionId, name: string) {
        return new TodoCollection(id, name);
    }
}
