// @flow

import randomString from 'randomstring';
import Todo from '../../todo';

class TodoBuilder {
    _id: string;
    _isCompleted: boolean;
    _name: string;

    _id = randomString.generate();
    _isCompleted = false;
    _name = randomString.generate();

    constructor() {
        return this;
    }

    isCompleted() {
        this._isCompleted = true;
        return this;
    }

    build() {
        return Todo.create(this._id, this._name, this._isCompleted);
    }
}

const aTodo = () => new TodoBuilder();

export default aTodo;
