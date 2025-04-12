// src/db/sqlHelper.js
import initSqlJs from "sql.js";

let dbInstance = null;

export const initDb = async () => {
  const SQL = await initSqlJs();
  dbInstance = new SQL.Database();
  return dbInstance;
};

export const runQuery = (sql, params = []) => {
  if (!dbInstance) throw new Error("DB not initialized");
  return dbInstance.exec(sql, params);
};
