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
    });

    test('constructor', () => {
        // GIVEN
        const collectionId = TodoCollectionId.newId();
        const todoIds = ['todo-1', 'todo-2'];
        const name = 'my collection';

        // WHEN
        const actual = new TodoCollection(collectionId, name);

        // THEN
        expect(actual.name).toEqual(name);
        expect(actual.id).toEqual(collectionId);
    });
});
