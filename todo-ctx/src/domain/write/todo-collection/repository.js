// @flow

import type TodoCollection from './todo-collection';
import type TodoCollectionId from './todo-collection-id';

export interface TodoCollectionRepository {
    persist(todoCollection: TodoCollection): Promise<void>;
    findById(id: TodoCollectionId): Promise<?TodoCollection>;
}
