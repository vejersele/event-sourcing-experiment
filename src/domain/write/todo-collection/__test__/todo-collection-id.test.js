// @flow

import TodoCollectionId from '../todo-collection-id';

describe('TodoCollectionId', () => {
    describe('newId', () => {
        it('Should create a new id', () => {
            const id = TodoCollectionId.newId();
            expect(id.value).toBeDefined();
        });
    });

    describe('from', () => {
        it('should create an TodoCollectionId instance', () => {
            // GIVEN
            const id = 'f64f2940-fae4-11e7-8c5f-ef356f279131';

            // WHEN
            const actual = TodoCollectionId.from(id);

            // THEN
            expect(actual.value).toEqual(id);
        });
    });
});
