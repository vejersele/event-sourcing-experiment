// @flow

import { type JestObjectType } from 'jest';

export const collectionRepositoryMock = (jest: JestObjectType) => ({
    persist: jest.fn(),
    update: jest.fn(),
    findById: jest.fn()
});

export const todoRepositoryMock = (jest: JestObjectType) => ({
    persist: jest.fn(),
    findById: jest.fn(),
    update: jest.fn()
});
