// @flow

import { TodoCollectionId, type TodoCollectionRepository } from '../domain/write/todo-collection';
import { type TodoRepository, TodoId, Todo } from '../domain/write/todo';
import { TodoCollectionDoesNotExist } from './error';

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

    async getTodoByIdOrThrow(id: string) {
        const todo = await this._todoRepository.findById(TodoId.from(id));

        if (!todo) {
            throw new Error(`Todo with id ${id} does not exist`);
        }

        return todo;
    }

    async setTodoCompleted(id: string, isCompleted: boolean): Promise<void> {
        const todo = await this.getTodoByIdOrThrow(id);

        if (isCompleted) {
            todo.markAsCompleted();
        } else {
            todo.markAsUncompleted();
        }

        await this._todoRepository.update(todo);
    }

    async setTodoName(id: string, name: string): Promise<void> {
        const todo = await this.getTodoByIdOrThrow(id);

        todo.name = name;

        await this._todoRepository.update(todo);
    }
}
