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

    addTodo(todo: Todo) {
        this._todos.push(todo);
    }

    addOrReplaceTodo(todo: Todo) {
        if (this.getTodoById(todo.id)) {
            this._replaceTodo(todo);
        } else {
            this.addTodo(todo);
        }
    }

    _replaceTodo(todo: Todo) {
        this._todos = this._todos.map(t => {
            if (t.id === todo.id) return todo;
            return t;
        });
    }

    getTodoById(todoId: string) {
        const results = this._todos.filter(todo => todo.id === todoId);
        return results.length > 0 ? results[0] : null;
    }

    static create(id: string, name: string, todos?: Array<Todo>) {
        return new TodoCollection(id, name, todos);
    }
}
