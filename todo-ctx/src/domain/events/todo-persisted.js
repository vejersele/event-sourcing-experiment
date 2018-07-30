// @flow

export default class TodoPersistedEvent {
    _id: string;
    _name: string;
    _isCompleted: boolean;
    _collectionId: string;

    constructor(id: string, name: string, collectionId: string, isCompleted: boolean) {
        this._id = id;
        this._name = name;
        this._collectionId = collectionId;
        this._isCompleted = isCompleted;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get collectionId(): string {
        return this._collectionId;
    }

    get isCompleted(): boolean {
        return this._isCompleted;
    }
}
