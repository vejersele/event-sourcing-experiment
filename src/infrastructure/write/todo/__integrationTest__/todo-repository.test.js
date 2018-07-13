// @flow

import TodoPersistedEvent from '../../../../domain/events/todo-persisted';
import { TodoId, Todo } from '../../../../domain/write/todo';
import { TodoCollectionId as CollectionId } from '../../../../domain/write/todo-collection';
import { TodoRepository } from '../index';
import { createConnection, endConnection } from '../../../utils/database';
import createWrapper from '../../../utils/rollback-transaction';
import EventBus from '../../../event-bus';

describe('TodoRepository', () => {
    let connection, repository, rollbackTransaction, eventBus;

    beforeAll(() => {
        eventBus = new EventBus();
        connection = createConnection();
        rollbackTransaction = createWrapper(connection);
        repository = new TodoRepository(connection, eventBus);

        jest.spyOn(eventBus, 'publish');
    });

    afterAll(() => {
        endConnection(connection);
    });

    describe('findById', () => {
        it('should return null when the todo does not exist', async () => {
            // GIVEN
            const nonExistingTodoId = TodoId.newId();

            // WHEN
            const actual = await repository.findById(nonExistingTodoId);

            // THEN
            expect(actual).not.toEqual(null);
        });

        it('should return the todo', async () => {
            // GIVEN
            const todo = Todo.create(TodoId.newId(), 'my todo', CollectionId.newId());

            // WHEN
            todo.markAsCompleted();
            await repository.persist(todo);
            const actual = (await repository.findById(todo.id)) || {};

            // THEN
            expect(actual.id.value).toBe(todo.id.value);
            expect(actual.isCompleted).toBe(true);
            expect(actual.name).toBe(todo.name);
        });
    });

    describe('persist', () => {
        it('should persist a todo', async () => {
            await rollbackTransaction(async () => {
                // GIVEN
                const todo = Todo.create(TodoId.newId(), 'my todo', CollectionId.newId());

                // WHEN
                await repository.persist(todo);
                const actual = await repository.findById(todo.id);

                // THEN
                expect(actual).toEqual(todo);
            });
        });

        it('should publish a TodoPersistedEvent', async () => {
            await rollbackTransaction(async () => {
                // GIVEN
                const todo = Todo.create(TodoId.newId(), 'my todo', CollectionId.newId());

                // WHEN
                await repository.persist(todo);

                // THEN
                expect(eventBus.publish).toHaveBeenCalledWith(
                    new TodoPersistedEvent(
                        todo.id.value,
                        todo.name,
                        todo.collectionId.value,
                        todo.isCompleted
                    )
                );
            });
        });
    });

    describe('update', () => {
        it('should update the todo', async () => {
            await rollbackTransaction(async () => {
                // GIVEN
                const todo = Todo.create(TodoId.newId(), 'my todo', CollectionId.newId());
                await repository.persist(todo);

                // WHEN
                todo.markAsCompleted();
                await repository.update(todo);

                const actual = (await repository.findById(todo.id)) || {};

                // THEN
                expect(actual.isCompleted).toBe(true);
            });
        });

        it('should publish a TodoPersisted Event', async () => {
            await rollbackTransaction(async () => {
                // GIVEN
                const todo = Todo.create(TodoId.newId(), 'my todo', CollectionId.newId());
                await repository.persist(todo);
                eventBus.publish.mockClear();

                // WHEN
                todo.markAsCompleted();
                await repository.update(todo);

                // THEN
                expect(eventBus.publish).toHaveBeenCalledWith(
                    new TodoPersistedEvent(
                        todo.id.value,
                        todo.name,
                        todo.collectionId.value,
                        todo.isCompleted
                    )
                );
            });
        });
    });
});
