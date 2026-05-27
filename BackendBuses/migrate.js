require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const db = {
  createTable: (name, cols, cb) => {
    const colDefs = Object.entries(cols).map(([col, def]) => {
      if(col === 'id') return `id SERIAL PRIMARY KEY`;
      let sql = `${col}`;
      if(def.type === 'string') sql += ` VARCHAR(${def.length || 255})`;
      else if(def.type === 'int') sql += ` INTEGER`;
      else if(def.type === 'boolean') sql += ` BOOLEAN`;
      else if(def.type === 'datetime') sql += ` TIMESTAMP`;
      else if(def.type === 'decimal') sql += ` NUMERIC(${def.precision||10},${def.scale||2})`;
      else if(def.type === 'text') sql += ` TEXT`;
      else if(def.type === 'smallint') sql += ` SMALLINT`;
      else if(def.type === 'date') sql += ` DATE`;
      else if(def.type === 'time') sql += ` TIME`;
      else if(def.type === 'interval') sql += ` INTERVAL`;
      if(def.notNull) sql += ` NOT NULL`;
      if(def.unique) sql += ` UNIQUE`;
      if(def.defaultValue !== undefined) {
        const dv = def.defaultValue;
        if(typeof dv === 'object' && dv.toString) sql += ` DEFAULT ${dv.toString().replace('new String(','').replace(')','').replace(/'/g,"'")}`;
        else if(typeof dv === 'boolean') sql += ` DEFAULT ${dv}`;
        else sql += ` DEFAULT '${dv}'`;
      }
      return sql;
    });
    const sql = `CREATE TABLE IF NOT EXISTS "${name}" (${colDefs.join(', ')})`;
    pool.query(sql).then(() => cb()).catch(e => { console.error('createTable error:', e.message); cb(); });
  },
  runSql: (sql, cb) => {
    pool.query(sql).then(() => cb && cb()).catch(e => { console.error('runSql error:', e.message); cb && cb(); });
  },
  addColumn: (table, col, def, cb) => { cb && cb(); },
  addIndex: (table, cols, opts, cb) => { cb && cb(); },
};

async function run() {
  const fs = require('fs');
  const files = fs.readdirSync('./migrations').sort();
  for(const file of files) {
    delete require.cache[require.resolve('./migrations/' + file)];
    const mod = require('./migrations/' + file);
    if(mod.up) {
      await new Promise(res => mod.up(db, res));
      console.log('OK:', file);
    }
  }
  await pool.end();
  console.log('DONE');
}
run().catch(console.error);
