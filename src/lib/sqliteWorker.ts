import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

let db;
try {
  const sqlite3 = await sqlite3InitModule({
    print: console.log,
    printErr: console.error,
  });
  db = new sqlite3.oo1.DB(':memory:'); // /aqi.sqlite?vfs=http
} catch (err) {
  console.error(err);
}

self.onmessage = e => {
  const result = db.exec({
    sql: e.data,
    returnValue: 'resultRows',
  });
  postMessage(result);
}

// CREATE TABLE test(city TEXT, state TEXT);
// INSERT INTO test(city, state) VALUES('New York', 'NY');
// INSERT INTO test(city, state) VALUES('Los Angeles', 'CA');
// SELECT COUNT(*) FROM test;

// Unclear if I can use the Promiser v2 API - can I define a custom vfs?