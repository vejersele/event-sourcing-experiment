// @flow

import { TodoCollectionId, TodoCollection } from '../../domain/write/todo-collection';
import TodoCollectionService from '../todo-collection-service';
import * as mocks from '../__mocks__';

describe('TodoCollectionService', () => {
    let service, collectionRepositoryMock, todoRepositoryMock;

    beforeEach(() => {
        collectionRepositoryMock = mocks.collectionRepositoryMock(jest);
        todoRepositoryMock = mocks.todoRepositoryMock(jest);

        service = new TodoCollectionService(collectionRepositoryMock);
    });

    describe('createTodoCollection', () => {
        it('should create a TodoCollection and return the ID', async () => {
            // GIVEN
            const todoCollectionName = 'myCollection';

            // WHEN
            const actual = await service.createTodoCollection(todoCollectionName);

            // THEN
            expect(collectionRepositoryMock.persist).toHaveBeenCalled();

            const persistedTodoCollection: TodoCollection =
                collectionRepositoryMock.persist.mock.calls[0][0];

            expect(persistedTodoCollection.id).toBeDefined();
            expect(persistedTodoCollection.name).toBe(todoCollectionName);

            expect(actual).toBe(persistedTodoCollection.id.value);
        });
    });

    describe('getTodoCollectionById', () => {
        it('should return a todoCollection', async () => {
            // GIVEN
            const id = TodoCollectionId.newId();
            const name = 'myCollection';
            const todoCollection = TodoCollection.create(id, name);

            collectionRepositoryMock.findById.mockReturnValue(Promise.resolve(todoCollection));

            // WHEN
            const actual = await service.getTodoCollectionById(id.value);

            // THEN
            expect(collectionRepositoryMock.findById).toHaveBeenCalledWith(id);
            expect(actual).toStrictEqual(todoCollection);
        });
    });
});
