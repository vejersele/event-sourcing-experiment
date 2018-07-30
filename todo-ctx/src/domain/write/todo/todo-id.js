// @flow

import uuid from 'uuid/v1';

export default class TodoId {
    _value: string;

    constructor(id: string): void {
        this._value = id;
    }

    get value(): string {
        return this._value;
    }

    static newId() {
        return new TodoId(uuid());
    }

    static from(value: string) {
        return new TodoId(value);
    }
}
