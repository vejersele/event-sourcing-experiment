// @flow

const Spinner = require('ora');
const mysql = require('mysql');

const createConnection = () => {
    const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } = process.env;

    if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_PASSWORD || !MYSQL_DATABASE || !MYSQL_PORT) {
        throw new Error('Missing env for');
    }

    return mysql.createConnection({
        host: MYSQL_HOST,
        port: parseInt(MYSQL_PORT, 0),
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE
    });
};

const ping = cb => {
    const connection = createConnection();

    connection.ping(err => {
        connection.end();

        if (err) {
            cb(err);
            return;
        }

        cb();
    });
};

const waitForMysql = () => {
    const spinner = new Spinner({
        text: 'Waiting for mysql to become available ...'
    });

    spinner.start();

    const promise = new Promise((resolve, reject) => {
        const handlePing = err => {
            if (err) {
                setTimeout(() => {
                    ping(handlePing);
                }, 1000);
                return;
            }

            resolve();
        };

        ping(handlePing);
    });

    return promise
        .then(res => {
            spinner.succeed('Mysql is available!');
        })
        .catch(e => {
            console.error('Something went wrong ...');
        });
};

waitForMysql();
