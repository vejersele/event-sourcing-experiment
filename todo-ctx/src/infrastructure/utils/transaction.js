// @flow

import { type Connection } from 'mysql';

const createTransactionWrapper = <R>(connection: Connection) => (
    transaction: () => Promise<R>
): Promise<R> => {
    return new Promise((resolve, reject) => {
        connection.beginTransaction(async () => {
            transaction()
                .then(result => {
                    connection.commit(err => {
                        if (err) {
                            connection.rollback(() => {
                                reject(err);
                            });
                        }

                        resolve(result);
                    });
                })
                .catch(err => {
                    connection.rollback(() => {
                        reject(err);
                    });
                });
        });
    });
};

export default createTransactionWrapper;
