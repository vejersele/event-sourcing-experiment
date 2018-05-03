// @flow

import { object, string } from 'flow-validator';

export { default as TodoRepository } from './todo-repository';

export const CreateTodoTO = object({
    todoName: string,
    collectionId: string
});
