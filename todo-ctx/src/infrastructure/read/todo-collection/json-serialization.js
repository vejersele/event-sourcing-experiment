// @flow

import type { TodoCollection } from '../../../domain/read/todo-collection';

export const serialize = (todoCollection: TodoCollection) => ({
    id: todoCollection.id,
    name: todoCollection.name,
    todos: todoCollection.todos.map(todo => ({
        id: todo.id,
        name: todo.name,
        isCompleted: todo.isCompleted
    }))
});
