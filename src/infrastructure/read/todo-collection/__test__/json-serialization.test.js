// @flow

import aTodoCollection from '../../../../domain/read/todo-collection/__test__/builder/todo-collection';
import { serialize } from '../json-serialization';

describe('todo collection - json', () => {
    it('should serialize a TodoCollection', () => {
        // GIVEN
        const todoCollection = aTodoCollection()
            .withTodo()
            .withCompletedTodo()
            .withTodo()
            .build();

        // WHEN
        const actual = serialize(todoCollection);

        // THEN
        expect(actual).toStrictEqual({
            id: todoCollection.id,
            name: todoCollection.name,
            todos: todoCollection.todos.map(todo => ({
                id: todo.id,
                name: todo.name,
                isCompleted: todo.isCompleted
            }))
        });
    });
});
