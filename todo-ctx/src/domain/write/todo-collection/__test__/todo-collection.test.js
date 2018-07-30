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
        expect(actual.id).toBe(id);
        expect(actual.name).toBe(name);
    });

    test('constructor', () => {
        // GIVEN
        const collectionId = TodoCollectionId.newId();
        const todoIds = ['todo-1', 'todo-2'];
        const name = 'my collection';

        // WHEN
        const actual = new TodoCollection(collectionId, name);

        // THEN
        expect(actual.name).toBe(name);
        expect(actual.id).toStrictEqual(collectionId);
    });
});
