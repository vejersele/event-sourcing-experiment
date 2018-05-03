// @flow

import Todo from '../todo';

describe('Todo', () => {
    test('create a todo', () => {
        // GIVEN
        const id = 'todo-1';
        const name = 'my todo';
        const isCompleted = false;

        // WHEN
        const actual = Todo.create(id, name, isCompleted);

        // THEN
        expect(actual.id).toBe(id);
        expect(actual.name).toBe(name);
        expect(actual.isCompleted).toBe(isCompleted);
    });
});
