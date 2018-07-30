// @flow

import { type Connection } from 'mysql';

const createWrapper = (connection: Connection) => (
    transaction: () => Promise<*>
): Promise<void> => {
    return new Promise((resolve, reject) => {
        connection.beginTransaction(async () => {
            transaction().then(() => {
                connection.rollback(() => {});
                resolve();
            });
        });
    });
};

export default createWrapper;
