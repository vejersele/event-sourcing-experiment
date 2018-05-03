// @flow

import type TodoCollection from './todo-collection';

export interface TodoCollectionDAO {
    findById(id: string): Promise<?TodoCollection>;
    persist(todoCollection: TodoCollection): Promise<void>;
}
