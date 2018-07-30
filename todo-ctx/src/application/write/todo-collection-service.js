// @flow

import {
    TodoCollectionId,
    TodoCollection,
    type TodoCollectionRepository
} from '../../domain/write/todo-collection';
import { Todo, TodoId, TodoRepository } from '../../domain/write/todo';
import { TodoCollectionDoesNotExist } from './errors';

export default class TodoCollectionService {
    _collectionRepository: TodoCollectionRepository;

    constructor(collectionRepository: TodoCollectionRepository) {
        this._collectionRepository = collectionRepository;
    }

    async createTodoCollection(name: string): Promise<string> {
        const id = TodoCollectionId.newId();
        const todoCollection = TodoCollection.create(id, name);

        await this._collectionRepository.persist(todoCollection);

        return todoCollection.id.value;
    }
}
