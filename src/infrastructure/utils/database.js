// @flow

import mysql, { type Connection as MysqlConnection } from 'mysql';

export const createConnection = () => {
    const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } = process.env;

    if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_PASSWORD || !MYSQL_DATABASE || !MYSQL_PORT)
        throw Error();

    return mysql.createConnection({
        host: MYSQL_HOST,
        port: parseInt(MYSQL_PORT, 0),
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE
    });
};

export const endConnection = (connection: MysqlConnection) => connection.end();
