// @flow

import { collectionDAO } from '../../__mocks__/index';
import { TodoCollectionPersisted } from '../../../domain/events/index';
import { TodoCollection } from '../../../domain/read/todo-collection/index';
import TodoCollectionPersistedHandler from '../todo-collection-persisted-handler';

describe('TodoCollectionPersistedHandler', () => {
    let collectionDAOMock;

    beforeEach(() => {
        collectionDAOMock = collectionDAO(jest);
    });

    test('Should persist read model', async () => {
        // GIVEN
        const id = 'id-1';
        const name = 'collection-1';
        const handler = new TodoCollectionPersistedHandler(collectionDAOMock);
        const event = new TodoCollectionPersisted(id, name);

        // WHEN
        await handler.handle(event);

        // THEN
        expect(collectionDAOMock.persist).toHaveBeenCalledWith(TodoCollection.create(id, name));
    });
});
