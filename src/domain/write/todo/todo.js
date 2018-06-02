// @flow

import type TodoId from './todo-id';
import { TodoCollectionId as CollectionId } from '../todo-collection';

export default class Todo {
    _id: TodoId;
    _name: string;
    _isCompleted: boolean;
    _collectionId: CollectionId;

    constructor(
        id: TodoId,
        name: string,
        collectionId: CollectionId,
        isCompleted: boolean = false
    ) {
        this._id = id;
        this._name = name;
        this._isCompleted = isCompleted;
        this._collectionId = collectionId;
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

    get collectionId(): CollectionId {
        return this._collectionId;
    }

    markAsCompleted() {
        this._isCompleted = true;
    }

    markAsUncompleted() {
        this._isCompleted = false;
    }

    static create(id: TodoId, name: string, collectionId: CollectionId): Todo {
        return new Todo(id, name, collectionId);
    }
}
