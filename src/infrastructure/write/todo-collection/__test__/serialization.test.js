// @flow

import { TodoCollection, TodoCollectionId } from '../../../../domain/write/todo-collection';
import { toJSON } from '../../todo-collection';

describe('serialization', () => {
    it('should serialize a todo-collection', () => {
        // GIVEN
        const id = TodoCollectionId.newId();
        const name = 'myCollection';

        const todoCollection = TodoCollection.create(id, name);

        // WHEN
        const actual = toJSON(todoCollection);

        // THEN
        expect(actual).toEqual({
            id: id.value,
            name: name
        });
    });
});
