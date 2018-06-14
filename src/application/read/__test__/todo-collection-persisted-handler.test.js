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

    test('Should persist read model', () => {
        // GIVEN
        const id = 'id-1';
        const name = 'collection-1';
        const handler = new TodoCollectionPersistedHandler(collectionDAOMock);
        const event = new TodoCollectionPersisted(id, name);

        // WHEN
        handler.handle(event);

        // THEN
        expect(collectionDAOMock.persistReadModel).toHaveBeenCalledWith(
            TodoCollection.create(id, name)
        );
    });
});
