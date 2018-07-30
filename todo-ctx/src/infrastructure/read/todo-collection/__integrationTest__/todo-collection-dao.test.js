// @flow

import aTodoCollection from '../../../../domain/read/todo-collection/__testBuilder__/todo-collection';
import { createConnection, endConnection } from '../../../utils/database';
import createWrapper from '../../../utils/rollback-transaction';
import { TodoCollectionDAO } from '../index';

describe('TodoCollectionDAO', () => {
    let connection, dao, rollbackTransaction;

    beforeAll(() => {
        connection = createConnection();
        rollbackTransaction = createWrapper(connection);
        dao = new TodoCollectionDAO(connection);
    });

    afterAll(() => {
        endConnection(connection);
    });

    test('findById - with todos', async () => {
        await rollbackTransaction(async () => {
            // GIVEN
            const todoCollection = aTodoCollection()
                .withTodo()
                .withCompletedTodo()
                .withCompletedTodo()
                .build();

            await dao.persist(todoCollection);

            // WHEN
            const actual = await dao.findById(todoCollection.id);

            // THEN
            expect(actual).toStrictEqual(todoCollection);
        });
    });

    test('findById - without todos should return an empty array', async () => {
        // GIVEN
        const todoCollection = aTodoCollection().build();
        await dao.persist(todoCollection);

        // WHEN
        const actual = await dao.findById(todoCollection.id);

        // THEN
        expect(actual).toStrictEqual(todoCollection);
    });
});
