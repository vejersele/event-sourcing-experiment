// @flow

export class TodoCollectionDoesNotExist extends Error {
    constructor(message: string) {
        super(message);
    }
}
