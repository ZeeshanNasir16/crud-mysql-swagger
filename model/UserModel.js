import QueryDB from '../utils/dbConfig.js';
import bcrypt from 'bcrypt';
import logger from '../utils/logger.js';

export const UserModel = {
  getAll: () => QueryDB('Select * from employees'),
  getById: (id) => QueryDB('Select * from emps where id = ?', [id]),
  create: async (vals) => {
    const open_password = await bcrypt.hash(vals.password, 10);
    return QueryDB(
      'Insert into employees (fullname, email, password, salary, role, address,open_password) values(?,?,?,?,?,?,?)',
      [...Object.values(vals), open_password]
    );
  },
  update: async (vals, id) => {
    let query = 'UPDATE employees SET ';
    let queryParams = [];
    let fieldsToUpdate = [];
    if (vals.password)
      vals.open_password = await bcrypt.hash(vals.password, 10);

    for (const [key, value] of Object.entries(vals)) {
      fieldsToUpdate.push(`${key} = ?`);
      queryParams.push(value);
    }
    query += fieldsToUpdate.join(', ');
    query += ' WHERE emp_id = ?';
    queryParams.push(id);
    return QueryDB(query, queryParams);
  },
  delete: (id) => QueryDB('Delete from employees where emp_id = ?', [id]),
  login: (email) => QueryDB('Select * from emps where email = ?', [email]),
  signup: async (vals) => {
    const open_password = await bcrypt.hash(vals.password, 10);
    const { email, fullname, password, cnic } = vals;
    return QueryDB(
      'Insert into emps (fullname, email, password, cnic) values(?,?,?,?)',
      [fullname, email, open_password, cnic]
    );
  },
};
