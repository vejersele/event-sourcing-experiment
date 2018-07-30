// @flow

import {
    TodoCollectionId,
    type TodoCollectionRepository
} from '../../domain/write/todo-collection';
import { type TodoRepository, TodoId, Todo } from '../../domain/write/todo';
import { TodoCollectionDoesNotExist, TodoDoesNotExist } from './errors';

export default class TodoService {
    _todoCollectionRepository: TodoCollectionRepository;
    _todoRepository: TodoRepository;

    constructor(
        todoCollectionRepository: TodoCollectionRepository,
        todoRepository: TodoRepository
    ) {
        this._todoCollectionRepository = todoCollectionRepository;
        this._todoRepository = todoRepository;
    }

    async _getTodoByIdOrThrow(id: string) {
        const todo = await this._todoRepository.findById(TodoId.from(id));

        if (!todo) {
            throw new TodoDoesNotExist(`Todo with id ${id} does not exist`);
        }

        return todo;
    }

    async createTodo(todoName: string, collectionIdAsString: string): Promise<string> {
        const collectionId = TodoCollectionId.from(collectionIdAsString);

        const collection = await this._todoCollectionRepository.findById(collectionId);

        if (!collection) {
            throw new TodoCollectionDoesNotExist(
                `Todo Collection with id ${collectionId.value} does not exist`
            );
        }

        const todo = Todo.create(TodoId.newId(), todoName, collectionId);
        await this._todoRepository.persist(todo);

        return todo.id.value;
    }

    async markTodoAsCompleted(id: string): Promise<void> {
        const todo = await this._getTodoByIdOrThrow(id);

        todo.markAsCompleted();

        await this._todoRepository.update(todo);
    }

    async markTodoAsUnCompleted(id: string): Promise<void> {
        const todo = await this._getTodoByIdOrThrow(id);

        todo.markAsUncompleted();

        await this._todoRepository.update(todo);
    }

    async renameTodo(id: string, name: string): Promise<void> {
        const todo = await this._getTodoByIdOrThrow(id);

        todo.name = name;

        await this._todoRepository.update(todo);
    }
}
