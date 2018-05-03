// @flow

import TodoId from '../todo-id';

describe('TodoId', () => {
    describe('newId', () => {
        it('Should create a new id', () => {
            const id = TodoId.newId();
            expect(id.value).toBeDefined();
        });
    });

    describe('from', () => {
        it('should create an TodoId instance', () => {
            // GIVEN
            const id = 'f64f2940-fae4-11e7-8c5f-ef356f279131';

            // WHEN
            const actual = TodoId.from(id);

            // THEN
            expect(actual.value).toEqual(id);
        });
    });
});
