// @flow

import TodoCollection from '../todo-collection';
import TodoCollectionId from '../todo-collection-id';

describe('TodoCollection', () => {
    it('CreateATodoCollection', () => {
        // GIVEN
        const id = TodoCollectionId.newId();
        const name = 'collection';

        // WHEN
        const actual = TodoCollection.create(id, name);

        // THEN
        expect(actual.id).toEqual(id);
        expect(actual.name).toEqual(name);
        expect(actual.isDeleted).toEqual(false);
        expect(actual.todos.length).toBe(0);
    });

    test('constructor', () => {
        // GIVEN
        const collectionId = TodoCollectionId.newId();
        const todoIds = ['todo-1', 'todo-2'];
        const name = 'my collection';

        // WHEN
        const actual = new TodoCollection(collectionId, name, todoIds);

        // THEN
        expect(actual.name).toEqual(name);
        expect(actual.todos).toEqual(todoIds);
        expect(actual.id).toEqual(collectionId);
    });

    test('Add a todoId', () => {
        // GIVEN
        const todoCollection = TodoCollection.create(TodoCollectionId.newId(), 'my collection');
        const todoId = 'todo-1';

        // WHEN
        todoCollection.addTodo(todoId);

        // THEN
        expect(todoCollection.todos).toEqual([todoId]);
    });
});
