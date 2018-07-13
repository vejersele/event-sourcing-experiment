// @flow

import request from 'supertest';
import aTodoCollection from '../../domain/read/todo-collection/__test__/builder/todo-collection';
import { TodoCollection, TodoCollectionId } from '../../domain/write/todo-collection';
import { TodoCollectionDAO } from '../../infrastructure/read/todo-collection';
import { TodoCollectionRepository } from '../../infrastructure/write/todo-collection';
import { createConnection, endConnection } from '../../infrastructure/utils/database';
import initializeApp from '../app';
import EventBus from '../../infrastructure/event-bus';

describe('/app', () => {
    let connection, repository, dao, app, collectionRepository, eventBus;

    const NON_EXISTING_ID = 'non-existing-id';

    beforeAll(() => {
        connection = createConnection();
        dao = new TodoCollectionDAO(connection);
        eventBus = new EventBus();
        collectionRepository = new TodoCollectionRepository(connection, eventBus);
        app = initializeApp(connection);
    });

    afterAll(() => {
        endConnection(connection);
    });

    const postTodoCollection = name =>
        request(app)
            .post('/todo-collection')
            .send({
                name
            });

    const getTodoCollection = id => request(app).get(`/todo-collection/${id}`);

    const postTodo = (collectionId, todoName) =>
        request(app)
            .post('/todo')
            .send({
                collectionId,
                todoName
            });

    const putTodoCompleted = (todoId, isCompleted) =>
        request(app)
            .put(`/todo/${todoId}/completed`)
            .send({
                isCompleted
            });

    describe('get /todo-collection/:id', () => {
        it('should return 404 when the item is not found', async () => {
            // GIVEN
            const notExistingId = NON_EXISTING_ID;

            // WHEN
            const response = await getTodoCollection(notExistingId);

            // THEN
            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({
                message: 'not found'
            });
        });

        it('should return 200 when the item is found', async () => {
            // GIVEN
            const todoCollection = aTodoCollection()
                .withCompletedTodo()
                .withTodo()
                .build();

            await dao.persist(todoCollection);

            // WHEN
            const response = await getTodoCollection(todoCollection.id);

            // THEN
            expect(response.statusCode).toBe(200);
            expect(response.body.data.id).toBe(todoCollection.id);
            expect(response.body.data.name).toBe(todoCollection.name);

            expect(response.body.data.todos).toEqual(
                todoCollection.todos.map(todo => ({
                    id: todo.id,
                    name: todo.name,
                    isCompleted: todo.isCompleted
                }))
            );
        });
    });

    describe('post /todo-collection', () => {
        it('should respond with 200 and return the id', async () => {
            // GIVEN
            const name = 'myTodoCollection';

            // WHEN
            const response = await postTodoCollection(name);

            // THEN
            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBeDefined();
        });

        it('should persist a todo collection', async () => {
            // GIVEN
            const name = 'myTodoCollection';

            // WHEN
            const postResponse = await postTodoCollection(name);
            const getResponse = await getTodoCollection(postResponse.body.id);

            // THEN
            expect(getResponse.body).toEqual({
                data: {
                    id: postResponse.body.id,
                    name: name,
                    todos: []
                }
            });
        });
    });

    describe('post /todo', () => {
        it('should return 400 when the collectionId is invalid', async () => {
            // GIVEN
            const nonExistingCollectionId = NON_EXISTING_ID;
            const name = 'my todo';

            // WHEN
            const response = await postTodo(nonExistingCollectionId, name);

            // THEN
            expect(response.statusCode).toBe(400);
        });

        it('should return the created todo id', async () => {
            // GIVEN
            const todoCollection = TodoCollection.create(
                TodoCollectionId.newId(),
                'collectionName'
            );

            const todoName = 'my todo';

            await collectionRepository.persist(todoCollection);

            // WHEN
            const response = await postTodo(todoCollection.id.value, todoName);

            // THEN
            expect(response.statusCode).toBe(200);
            expect(response.body.data.id).toBeDefined();
        });
    });

    describe('put /todo/{id}/completed', () => {
        it('should return 400 when the todo does not exist', async () => {
            // GIVEN
            const nonExistingTodoId = NON_EXISTING_ID;
            const isCompleted = true;

            // WHEN
            const response = await putTodoCompleted(nonExistingTodoId, isCompleted);

            // THEN
            expect(response.statusCode).toBe(400);
        });

        it('should respond with 200 and update the completed status', async () => {
            // GIVEN
            const collectionName = 'my collection';
            const todoName = 'todo';
            const isCompleted = true;

            // WHEN
            const {
                body: { id: collectionId }
            } = await postTodoCollection(collectionName);
            const {
                body: {
                    data: { id: todoId }
                }
            } = await postTodo(collectionId, todoName);

            const { statusCode } = await putTodoCompleted(todoId, isCompleted);

            const {
                body: {
                    data: { todos }
                }
            } = await getTodoCollection(collectionId);

            // THEN
            expect(statusCode).toBe(200);
            expect(todos[0].isCompleted).toBe(true);
        });
    });
});
