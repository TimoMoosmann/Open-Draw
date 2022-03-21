const sqlite3 = require('sqlite3').verbose();
const commonTags  = require('common-tags');
const stripIndent = commonTags.stripIndent;

const openWithoutForeignKeys = pathToDB => new Promise((resolve, reject) => {
  new sqlite3.Database(
    pathToDB,
    function(err) {
      if (err) {
        reject(err);
      }
      resolve(this);
    }
  )
});

const open = async pathToDB => {
  const db = await openWithoutForeignKeys(pathToDB);
  await run({db, stmt: "PRAGMA foreign_keys = ON"});
  return db;
};

const getAll = ({db, stmt}) => new Promise(
  (resolve, reject) => {
    db.all(
      stmt,
      function (err, rows) {
        if (err) {
          reject(err);
        }
        resolve(rows)
      }
    );
  }
);

const run = ({db, stmt, values = []}) => new Promise(
  (resolve, reject) => {
    db.run(
      stmt,
      values,
      function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID);
      }
    );
  }
);

const insertStmt = ({colNames, tableName}) => stripIndent`
  INSERT INTO ${tableName} (${colNames})
  VALUES (${"?,".repeat(colNames.length -1)}?)
`;

const updateStmt = ({colNames, idColName, rowID, tableName}) => stripIndent`
  UPDATE ${tableName}
  SET ${colNames.map(colName => `${colName} = ?`)}
  WHERE ${idColName} = ${rowID};
`;

const insert = async ({colNames, db, tableName, values}) => {
  return await run({
    db,
    stmt: insertStmt({colNames, tableName}),
    values,
  });
};

const update = async ({
  colNames, db, idColName, rowID, tableName, values
}) => {
  return await run({
    db,
    stmt: updateStmt({colNames, idColName, rowID, tableName}),
    values,
  });
};

const close = db => new Promise((resolve, reject) => {
  db.close(err => {
    if (err) reject(err);
    resolve();
  });
});

module.exports = {
  close,
  getAll,
  insert,
  open,
  run,
  update
};
