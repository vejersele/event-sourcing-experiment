// @flow

import type { EventHandler } from '../../domain/event-bus';
import type { TodoCollectionDAO } from '../../domain/read/todo-collection/index';

import TodoPersistedEvent from '../../domain/events/todo-persisted';
import { Todo } from '../../domain/read/todo-collection/index';

export default class TodoPersistedHandler implements EventHandler<TodoPersistedEvent> {
    _todoCollectionDAO: TodoCollectionDAO;

    Event = TodoPersistedEvent;

    constructor(todoCollectionDAO: TodoCollectionDAO) {
        this._todoCollectionDAO = todoCollectionDAO;
    }

    async handle(event: TodoPersistedEvent) {
        const todoCollection = await this._todoCollectionDAO.findById(event.collectionId);

        if (!todoCollection) return;

        const todo = Todo.create(event.id, event.name, event.isCompleted);

        todoCollection.addOrReplaceTodo(todo);

        await this._todoCollectionDAO.update(todoCollection);
    }
}
