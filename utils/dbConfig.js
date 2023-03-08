import mysql from 'mysql2/promise';

const options = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

export default async function QueryDB(sql, params = []) {
  const connection = await mysql.createConnection(options);
  const [rows] = await connection.execute(sql, params);
  return rows;
}
