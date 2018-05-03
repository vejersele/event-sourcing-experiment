// @flow

import randomString from 'randomstring';
import { TodoCollection, Todo } from '../../index';
import aTodo from './todo';

class TodoCollectionBuilder {
    _id: string;
    _name: string;
    _todos: Array<Todo>;

    _id = randomString.generate();
    _name = randomString.generate();
    _todos = [];

    constructor() {
        return this;
    }

    withTodo() {
        const todo = aTodo().build();
        this._todos = [...this._todos, todo];
        return this;
    }

    withCompletedTodo() {
        const todo = aTodo()
            .isCompleted()
            .build();

        this._todos = [...this._todos, todo];
        return this;
    }

    build() {
        return new TodoCollection.create(this._id, this._name, this._todos);
    }
}

const aTodoCollection = () => new TodoCollectionBuilder();

export default aTodoCollection;
