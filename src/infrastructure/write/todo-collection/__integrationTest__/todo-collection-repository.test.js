// @flow

import { type Connection } from 'mysql';
import { TodoCollectionId, TodoCollection } from '../../../../domain/write/todo-collection';
import { TodoCollectionPersisted } from '../../../../domain/events';
import { TodoCollectionRepository } from '../../todo-collection';
import { createConnection, endConnection } from '../../../utils/database';
import createWrapper from '../../../utils/rollback-transaction';
import EventBus from '../../../event-bus';

describe('TodoCollectionRepository', () => {
    let connection, repository, rollbackTransaction, eventBus;

    beforeAll(() => {
        eventBus = new EventBus();
        connection = createConnection();
        rollbackTransaction = createWrapper(connection);
        repository = new TodoCollectionRepository(connection, eventBus);

        jest.spyOn(eventBus, 'publish');
    });

    afterAll(() => {
        endConnection(connection);
    });

    describe('persist', () => {
        it('should persist a TodoCollection in the database and retrieve it', async () => {
            await rollbackTransaction(async () => {
                // GIVEN
                const id = TodoCollectionId.newId();
                const name = 'myCollection';
                const todoCollection = TodoCollection.create(id, name);

                // WHEN
                await repository.persist(todoCollection);
                const actual = await repository.findById(id);

                // THEN
                expect(actual).toEqual(todoCollection);
            });
        });

        it('should publish a TodoCollectionPersited event', async () => {
            await rollbackTransaction(async () => {
                // GIVEN
                const id = TodoCollectionId.newId();
                const name = 'myCollection';
                const todoCollection = TodoCollection.create(id, name);

                // WHEN
                await repository.persist(todoCollection);

                // THEN
                expect(eventBus.publish).toHaveBeenCalledWith(
                    new TodoCollectionPersisted(id.value, name)
                );
            });
        });
    });

    describe('findById', () => {
        it('should retrieve a todo collection with todo ids', async () => {
            await rollbackTransaction(async () => {
                // GIVEN
                const id = TodoCollectionId.newId();
                const name = 'myCollection';
                const todoCollection = TodoCollection.create(id, name);
                const todoIds = ['todo-1', 'todo-2'];

                await repository.persist(todoCollection);

                // WHEN
                const actual = await repository.findById(id);

                // THEN
                expect(actual).toEqual(todoCollection);
            });
        });
    });

    // describe('update', () => {
    //     it('should update the todo in the database', async () => {
    //         await rollbackTransaction(async () => {
    //             // GIVEN
    //             const id = TodoCollectionId.newId();
    //             const name = 'myCollection';
    //             const todoCollection = TodoCollection.create(id, name);
    //             const todoId = 'todo-1';
    //
    //             await repository.persist(todoCollection);
    //
    //             // WHEN
    //             repository.update(todoCollection);
    //             const actual = await repository.findById(todoCollection.id);
    //
    //             // THEN
    //             expect(actual).toEqual(todoCollection);
    //         });
    //     });
    // });
});
