// @flow

import { TodoCollection } from '../../../domain/write/todo-collection/';

export type TodoCollectionTO = {
    id: string,
    name: string
};

export const serialize = (todoCollection: TodoCollection): TodoCollectionTO => ({
    id: todoCollection.id.value,
    name: todoCollection.name
});
