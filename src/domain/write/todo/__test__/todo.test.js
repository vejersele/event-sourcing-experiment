// @flow

import Todo from '../todo';
import TodoId from '../todo-id';
import { TodoCollectionId as CollectionId } from '../../todo-collection';

describe('Todo', () => {
    const aTodo = () => Todo.create(TodoId.newId(), 'my todo', CollectionId.newId());

    test('create a todo', () => {
        // GIVEN
        const id = TodoId.newId();
        const name = 'my todo';
        const collectionId = CollectionId.newId();

        // WHEN
        const actual = Todo.create(id, name, collectionId);

        // THEN
        expect(actual.id).toEqual(id);
        expect(actual.name).toEqual(name);
        expect(actual.isCompleted).toEqual(false);
        expect(actual.collectionId).toEqual(collectionId);
    });

    test('initialize a Todo', () => {
        // GIVEN
        const id = TodoId.newId();
        const collectionId = CollectionId.newId();
        const name = 'my todo';
        const isCompleted = true;

        // WHEN
        const actual = new Todo(id, name, collectionId, isCompleted);

        // THEN
        expect(actual.id).toEqual(id);
        expect(actual.name).toBe(name);
        expect(actual.isCompleted).toBe(isCompleted);
    });

    test('mark as completed', () => {
        // GIVEN
        const todo = aTodo();

        // WHEN
        todo.markAsCompleted();

        // THEN
        expect(todo.isCompleted).toBe(true);
    });

    test('mark as uncompleted', () => {
        // GIVEN
        const todo = aTodo();

        // WHEN
        todo.markAsCompleted();
        todo.markAsUncompleted();

        // THEN
        expect(todo.isCompleted).toBe(false);
    });

    describe('set name', () => {
        it('should throw when trying to set the name to an empty string', () => {
            // GIVEN
            const todo = aTodo();

            // WHEN
            expect(() => {
                todo.name = '';
            })
                // THEN
                .toThrow();
        });

        it('should set the name', () => {
            // GIVEN
            const todo = aTodo();
            const todoName = 'my new name';

            // WHEN
            todo.name = todoName;

            // THEN
            expect(todo.name).toBe(todoName);
        });
    });
});
