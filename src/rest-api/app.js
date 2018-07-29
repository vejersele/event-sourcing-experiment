// @flow

import { string, boolean } from 'flow-validator';
import express, { type $Response, type $Request } from 'express';
import bodyParser from 'body-parser';
import { type Connection } from 'mysql';
import TodoCollectionPersistedHandler from '../application/read/todo-collection-persisted-handler';
import TodoPersistedHandler from '../application/read/todo-persisted-handler';
import TodoCollectionService from '../application/todo-collection-service';
import TodoService from '../application/todo-service';
import { TodoCollectionDAO, toJSON } from '../infrastructure/read/todo-collection';
import { TodoRepository } from '../infrastructure/write/todo';
import { TodoCollectionRepository } from '../infrastructure/write/todo-collection';
import EventBus from '../infrastructure/event-bus';
import createTransactionWrapper from '../infrastructure/utils/transaction';

const initializeApp = (connection: Connection) => {
    const app = express();
    const jsonParser = bodyParser.json();

    const eventBus = new EventBus();

    const todoCollectionRepository = new TodoCollectionRepository(connection, eventBus);
    const todoRepository = new TodoRepository(connection, eventBus);
    const todoCollectionDao = new TodoCollectionDAO(connection);

    const todoCollectionService = new TodoCollectionService(todoCollectionRepository);
    const todoService = new TodoService(todoCollectionRepository, todoRepository);

    const transaction = createTransactionWrapper(connection);

    eventBus.registerEventHandlers([
        new TodoCollectionPersistedHandler(todoCollectionDao),
        new TodoPersistedHandler(todoCollectionDao)
    ]);

    app.get('/todo-collection/:id', async (req: $Request, res: $Response) => {
        const id: string = string.parse(req.params.id);
        const todoCollection = await todoCollectionDao.findById(id);

        return todoCollection
            ? res.status(200).json({
                  data: toJSON(todoCollection)
              })
            : res.status(404).json({
                  message: 'not found'
              });
    });

    app.post('/todo-collection', jsonParser, async (req, res: $Response) => {
        const { body } = req;

        const collectionName: string = string.parse(body.name);

        const collectionId = await transaction(() =>
            todoCollectionService.createTodoCollection(collectionName)
        );

        res.status(200).json({
            id: collectionId
        });
    });

    app.post('/todo', jsonParser, async (req, res: $Response) => {
        try {
            const { body } = req;

            const collectionId: string = string.parse(body.collectionId);
            const todoName: string = string.parse(body.todoName);

            const id = await transaction(() => todoService.createTodo(todoName, collectionId));

            res.status(200).json({
                data: {
                    id
                }
            });
        } catch (e) {
            res.status(400).send();
        }
    });

    app.put('/todo/:id/completed', jsonParser, async (req, res: $Response) => {
        try {
            const { body, params } = req;

            const todoId: string = string.parse(params.id);
            const isCompleted: boolean = boolean.parse(body.isCompleted);

            if (isCompleted) {
                await transaction(() => todoService.markTodoAsCompleted(todoId));
            } else {
                await transaction(() => todoService.markTodoAsUnCompleted(todoId));
            }

            res.status(200).send();
        } catch (e) {
            res.status(400).send();
        }
    });

    return app;
};

export default initializeApp;
