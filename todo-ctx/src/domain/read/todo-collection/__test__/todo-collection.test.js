// @flow

import Todo from '../todo';
import TodoCollection from '../todo-collection';
import aTodo from '../__testBuilder__/todo';
import aTodoCollection from '../__testBuilder__/todo-collection';

describe('TodoCollection', () => {
    test('create a collection without todos, should default to an empty list', () => {
        // GIVEN
        const id = 'collection-1';
        const name = 'my collection';

        // WHEN
        const actual = TodoCollection.create(id, name);

        // THEN
        expect(actual.todos).toEqual([]);
    });

    test('create a collection with todos', () => {
        // GIVEN
        const id = 'collection-1';
        const name = 'my collection';
        const todos = [aTodo().build(), aTodo().build(), aTodo().build()];

        // WHEN
        const actual = TodoCollection.create(id, name, todos);

        // THEN
        expect(actual.id).toBe(id);
        expect(actual.name).toBe(name);
        expect(actual.todos).toEqual(todos);
    });

    test('add a todo', () => {
        // GIVEN
        const todoCollection = aTodoCollection().build();
        const todo = aTodo().build();

        // WHEN
        todoCollection.addTodo(todo);

        // THEN
        expect(todoCollection.todos).toStrictEqual([todo]);
    });

    test('add or replace todo', () => {
        // GIVEN
        const todoCollection = aTodoCollection().build();
        const id = 'id-1';
        const name = 'todo-1';
        const todo1 = Todo.create(id, name, false);
        const todo2 = Todo.create(id, name, true);

        todoCollection.addTodo(todo1);

        // WHEN
        todoCollection.addOrReplaceTodo(todo2);

        // THEN
        expect(todoCollection.todos).toStrictEqual([todo2]);
    });

    test('getTodoById', () => {
        // GIVEN
        const todoCollection = aTodoCollection().build();
        const todo = aTodo().build();
        todoCollection.addTodo(todo);

        // WHEN
        const actual = todoCollection.getTodoById(todo.id);

        // THEN
        expect(actual).toStrictEqual(todo);
    });
});
