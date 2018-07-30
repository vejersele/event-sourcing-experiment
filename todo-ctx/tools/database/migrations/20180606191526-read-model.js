'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

const renameTodoCollection = db =>
    new Promise((resolve, reject) => {
        db.renameTable('todo_collection', 'write_todo_collection', err => {
            if (err) {
                reject(err);
                return;
            }

            resolve(db);
        });
    });

const renameTodo = db =>
    new Promise((resolve, reject) => {
        db.renameTable('todo', 'write_todo', err => {
            if (err) {
                reject(err);
                return;
            }

            resolve(db);
        });
    });

const createTodoCollection = db =>
    new Promise((resolve, reject) => {
        db.createTable(
            'read_todo_collection',
            {
                id: { type: 'string', primaryKey: true },
                todo_collection: { type: 'json', notNull: true }
            },
            err => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(db);
            }
        );
    });

exports.up = function(db) {
    return renameTodoCollection(db)
        .then(renameTodo)
        .then(createTodoCollection);
};

exports.down = function(db) {
    return null;
};

exports._meta = {
    version: 1
};
