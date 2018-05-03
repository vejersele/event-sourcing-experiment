// @flow

export default class Todo {
    _id: string;
    _name: string;
    _isCompleted: boolean;

    constructor(id: string, name: string, isCompleted: boolean) {
        this._id = id;
        this._name = name;
        this._isCompleted = isCompleted;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get isCompleted(): boolean {
        return this._isCompleted;
    }

    static create(id: string, name: string, isCompleted: boolean) {
        return new Todo(id, name, isCompleted);
    }
}
