// @flow

import { collectionDAO } from '../../__mocks__/index';
import { TodoPersistedEvent } from '../../../domain/events/index';
import aTodo from '../../../domain/read/todo-collection/__testBuilder__/todo';
import aTodoCollection from '../../../domain/read/todo-collection/__testBuilder__/todo-collection';
import { TodoCollection, Todo } from '../../../domain/read/todo-collection/index';
import TodoPersistedHandler from '../todo-persisted-handler';

describe('TodoCollectionPersistedHandler', () => {
    let collectionDAOMock;

    beforeEach(() => {
        collectionDAOMock = collectionDAO(jest);
    });

    test('Should persist read model', async () => {
        // GIVEN
        const collection = aTodoCollection().build();
        const id = 'id-1';
        const name = 'todo-1';
        const isCompleted = false;
        const handler = new TodoPersistedHandler(collectionDAOMock);
        const event = new TodoPersistedEvent(id, name, collection.id, false);

        collectionDAOMock.findById.mockImplementation(
            id => (id === collection.id ? collection : null)
        );

        // WHEN
        await handler.handle(event);

        // THEN
        expect(collectionDAOMock.findById).toHaveBeenCalledWith(collection.id);
        expect(collectionDAOMock.update).toHaveBeenCalled();

        const newCollection: TodoCollection = collectionDAOMock.update.mock.calls[0][0];
        expect(newCollection.todos).toStrictEqual([Todo.create(id, name, isCompleted)]);
    });

    test('Should update and not duplicate already existing todos', async () => {
        // GIVEN
        const collection = aTodoCollection().build();
        const todo = aTodo().build();
        collection.addTodo(todo);

        const isCompleted = true;

        const handler = new TodoPersistedHandler(collectionDAOMock);
        const event = new TodoPersistedEvent(todo.id, todo.name, collection.id, isCompleted);

        collectionDAOMock.findById.mockImplementation(
            id => (id === collection.id ? collection : null)
        );

        // WHEN
        await handler.handle(event);

        // THEN
        const newCollection: TodoCollection = collectionDAOMock.update.mock.calls[0][0];
        expect(newCollection.todos.length).toBe(1);
        expect(newCollection.todos[0].isCompleted).toBe(true);
    });
});
