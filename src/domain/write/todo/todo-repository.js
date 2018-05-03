// @flow

import type Todo from './todo';
import type TodoId from './todo-id';

export interface TodoRepository {
    persist(todo: Todo): Promise<void>;
    update(todo: Todo): Promise<void>;
    findById(id: TodoId): Promise<?Todo>;
}
