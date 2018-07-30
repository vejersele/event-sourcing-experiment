// @flow

import { Todo } from '../../domain/write/todo';
import {
    TodoCollectionId as CollectionId,
    TodoCollection
} from '../../domain/write/todo-collection';
import { TodoId } from '../../domain/write/todo/index';
import TodoService from '../todo-service';
import * as mocks from '../__mocks__';

describe('TodoService', () => {
    let todoService, collectionRepositoryMock, todoRepositoryMock;

    beforeEach(() => {
        collectionRepositoryMock = mocks.collectionRepositoryMock(jest);
        todoRepositoryMock = mocks.todoRepositoryMock(jest);

        todoService = new TodoService(collectionRepositoryMock, todoRepositoryMock);
    });

    describe('createTodo', () => {
        test('add a todo when collection does not exist', async () => {
            // GIVEN
            const nonExistingCollectionId = CollectionId.newId();
            const todoName = 'my todo';

            collectionRepositoryMock.findById.mockReturnValue(Promise.resolve(null));

            // WHEN
            await expect(todoService.createTodo(todoName, nonExistingCollectionId.value))
                // THEN
                .rejects.toThrow();
        });

        test('add a todo', async () => {
            // GIVEN
            const collection = TodoCollection.create(CollectionId.newId(), 'my collection');
            const todoName = 'my todo';

            collectionRepositoryMock.findById.mockReturnValue(Promise.resolve(collection));

            // WHEN
            const actual = await todoService.createTodo(todoName, collection.id.value);

            // THEN
            expect(todoRepositoryMock.persist).toHaveBeenCalled();

            const persistedTodo: Todo = todoRepositoryMock.persist.mock.calls[0][0];

            expect(persistedTodo.id).toBeDefined();
            expect(persistedTodo.name).toEqual(todoName);
            expect(persistedTodo.isCompleted).toEqual(false);
            expect(persistedTodo.collectionId).toEqual(collection.id);

            expect(actual).toBe(persistedTodo.id.value);
        });
    });

    test('mark todo as completed', async () => {
        // GIVEN
        const id = TodoId.newId();
        const todo = Todo.create(id, 'my todo', CollectionId.newId());
        todoRepositoryMock.findById.mockImplementation(
            _id => (_id.value === id.value ? Promise.resolve(todo) : null)
        );

        // WHEN
        await todoService.markTodoAsCompleted(id.value);

        // THEN
        expect(todoRepositoryMock.update).toHaveBeenCalled();

        const updatedTodo: Todo = todoRepositoryMock.update.mock.calls[0][0];

        expect(updatedTodo.isCompleted).toBe(true);
    });

    test('mark todo as uncompleted', async () => {
        // GIVEN
        const id = TodoId.newId();
        const todo = Todo.create(id, 'my todo', CollectionId.newId());
        todoRepositoryMock.findById.mockImplementation(
            _id => (_id.value === id.value ? Promise.resolve(todo) : null)
        );

        // WHEN
        await todoService.markTodoAsUnCompleted(id.value);

        // THEN
        expect(todoRepositoryMock.update).toHaveBeenCalled();

        const updatedTodo: Todo = todoRepositoryMock.update.mock.calls[0][0];

        expect(updatedTodo.isCompleted).toBe(false);
    });

    test('set name of todo', async () => {
        // GIVEN
        const id = TodoId.newId();
        const todo = Todo.create(id, 'my todo', CollectionId.newId());
        todoRepositoryMock.findById.mockImplementation(
            _id => (_id.value === id.value ? Promise.resolve(todo) : null)
        );

        const newName = 'my new name';

        // WHEN
        await todoService.renameTodo(id.value, newName);

        // THEN
        expect(todoRepositoryMock.update).toHaveBeenCalled();

        const updatedTodo: Todo = todoRepositoryMock.update.mock.calls[0][0];

        expect(updatedTodo.name).toBe(newName);
    });
});
