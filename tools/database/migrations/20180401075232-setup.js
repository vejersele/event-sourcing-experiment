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

exports.up = function(db) {
    return db.createTable(
        'todo_collection',
        {
            id: { type: 'string', primaryKey: true },
            name: { type: 'string', notNull: true }
        },
        () => {
            db.createTable('todo', {
                sequence_id: { type: 'int', autoIncrement: true, notNull: true, primaryKey: true },
                id: { type: 'string', primaryKey: true },
                name: { type: 'string', notNull: true },
                is_completed: { type: 'boolean', notNull: true },
                collection_id: { type: 'string', notNull: true }
            });
        }
    );
};

exports.down = function(db) {
    return null;
};

exports._meta = {
    version: 1
};
