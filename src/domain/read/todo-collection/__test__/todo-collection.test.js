// @flow

import TodoCollection from '../todo-collection';
import aTodo from './builder/todo';
import aTodoCollection from './builder/todo-collection';

describe('TodoCollection', () => {
    test('create a collection without todos, should default to an empty list', () => {
        // GIVEN
        const id = 'collection-1';
        const name = 'my collection';

        // WHEN
        const actual = TodoCollection.create(id, name);

        // THEN
        expect(actual.todos).toEqual([]);
    });

    test('create a collection with todos', () => {
        // GIVEN
        const id = 'collection-1';
        const name = 'my collection';
        const todos = [aTodo().build(), aTodo().build(), aTodo().build()];

        // WHEN
        const actual = TodoCollection.create(id, name, todos);

        // THEN
        expect(actual.id).toBe(id);
        expect(actual.name).toBe(name);
        expect(actual.todos).toEqual(todos);
    });
});
