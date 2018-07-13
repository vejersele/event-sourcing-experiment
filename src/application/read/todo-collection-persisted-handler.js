// @flow

import { TodoCollectionPersisted } from '../../domain/events/index';
import type { TodoCollectionDAO } from '../../domain/read/todo-collection/index';
import { TodoCollection } from '../../domain/read/todo-collection';
import type { EventHandler } from '../../domain/event-bus';

export default class TodoCollectionPersistedHandler
    implements EventHandler<TodoCollectionPersisted> {
    Event = TodoCollectionPersisted;
    _todoCollectionDAO: TodoCollectionDAO;

    constructor(todoCollectionDAO: TodoCollectionDAO) {
        this._todoCollectionDAO = todoCollectionDAO;
    }

    async handle(event: TodoCollectionPersisted) {
        const todoCollection = TodoCollection.create(event.id, event.name);
        await this._todoCollectionDAO.persist(todoCollection);
    }
}
