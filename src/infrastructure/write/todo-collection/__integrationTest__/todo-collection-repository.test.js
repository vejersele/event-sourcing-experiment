// @flow

import { type Connection } from 'mysql';
import { TodoCollectionId, TodoCollection } from '../../../../domain/write/todo-collection';
import { TodoCollectionRepository } from '../../todo-collection';
import { createConnection, endConnection } from '../../../utils/database';
import createWrapper from '../../../utils/rollback-transaction';

describe('TodoCollectionRepository', () => {
    let connection, repository, rollbackTransaction;

    beforeAll(() => {
        connection = createConnection();
        rollbackTransaction = createWrapper(connection);
        repository = new TodoCollectionRepository(connection);
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
    });

    describe('findById', () => {
        it('should retrieve a todo collection with todo ids', async () => {
            await rollbackTransaction(async () => {
                // GIVEN
                const id = TodoCollectionId.newId();
                const name = 'myCollection';
                const todoCollection = TodoCollection.create(id, name);
                const todoIds = ['todo-1', 'todo-2'];
                // todoCollection.addTodo(todoIds[0]);
                // todoCollection.addTodo(todoIds[1]);

                await repository.persist(todoCollection);

                // WHEN
                const actual = await repository.findById(id);

                // THEN
                expect(actual).toEqual(todoCollection);
            });
        });
    });

    describe('update', () => {
        it('should update the todo in the database', async () => {
            await rollbackTransaction(async () => {
                // GIVEN
                const id = TodoCollectionId.newId();
                const name = 'myCollection';
                const todoCollection = TodoCollection.create(id, name);
                const todoId = 'todo-1';

                await repository.persist(todoCollection);

                // WHEN
                // todoCollection.addTodo(todoId);
                repository.update(todoCollection);
                const actual = await repository.findById(todoCollection.id);

                // THEN
                expect(actual).toEqual(todoCollection);
            });
        });
    });
});
