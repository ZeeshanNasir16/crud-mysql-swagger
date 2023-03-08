import { UserModel } from '../model/UserModel.js';
import catchAsync from '../utils/catchAsync.js';
import HttpException from '../utils/httpException.js';
import logger from '../utils/logger.js';
import { HTTPCodes } from '../utils/responses.js';
import transporter from '../utils/SendMail.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const UserController = {
  getAll: catchAsync(async (_, res, next) => {
    const result = await UserModel.getAll();

    if (result.length === 0)
      return next(new HttpException(HTTPCodes.OK, `No record found`));

    res.status(HTTPCodes.OK).json({
      status: 'success',
      employees: result,
    });
  }),

  getOne: catchAsync(async (req, res, next) => {
    const emp = await UserModel.getById(req.params.id);
    if (!emp || emp.length === 0)
      return next(
        new HttpException(
          HTTPCodes.NOT_FOUND,
          `User with id ${req.params.id} not found`
        )
      );

    res.status(HTTPCodes.OK).json({
      status: 'success',
      employee: emp,
    });
  }),

  create: catchAsync(async (req, res, next) => {
    const result = await UserModel.create(req.body);

    if (result.affectedRows === 1) {
      logger.info(`Record Inserted Successfully`);
      // Send email
      transporter(req.body.email);
      return res.status(HTTPCodes.CREATED).json({
        status: 'success',
        message: 'Record Inserted Successfully',
      });
    }
    return next(
      new HttpException(HTTPCodes.SERVER_ERROR, "Couldn't add employee.")
    );
  }),

  update: catchAsync(async (req, res, next) => {
    const result = await UserModel.update(req.body, req.params.id);
    if (result.affectedRows === 1)
      return res.status(HTTPCodes.CREATED).json({
        status: 'success',
        message: 'Record updated Successfully',
      });

    return next(
      new HttpException(
        HTTPCodes.NOT_FOUND,
        `Cant find any employee with id ${req.params.id}`
      )
    );
  }),

  delete: catchAsync(async (req, res, next) => {
    const result = await UserModel.delete(req.params.id);
    if (result.affectedRows === 1)
      return res.status(HTTPCodes.CREATED).json({
        status: 'success',
        message: 'Record deleted Successfully',
      });

    return next(
      new HttpException(HTTPCodes.SERVER_ERROR, "Couldn't delete employee.")
    );
  }),
  login: catchAsync(async (req, res, next) => {
    const [result] = await UserModel.login(req.body.email);
    console.log(result);
    if (!result) {
      return res.status(HTTPCodes.NOT_FOUND).json({
        status: 'success',
        message: 'User not found with this email.',
      });
    }
    const chk_password = bcrypt.compareSync(req.body.password, result.password);

    if (chk_password) {
      const token = signToken(result.id);
      res.set('Authorization', `Bearer ${token}`);
      return res.status(HTTPCodes.OK).json({
        status: 'success',
        message: 'User Logged In',
      });
    }

    return res.status(HTTPCodes.BAD_REQUEST).json({
      status: 'failed',
      message: 'Incorrect Password',
    });
  }),
  signup: catchAsync(async (req, res, next) => {
    const result = await UserModel.signup(req.body);
    console.log(result);
    if (result.affectedRows === 1) {
      logger.info(`Record Inserted Successfully`);
      // Send email
      transporter(req.body.email);
      const token = signToken(result.id);
      res.set('Authorization', `Bearer ${token}`);
      return res.status(HTTPCodes.CREATED).json({
        status: 'success',
        message: 'Record Inserted Successfully',
      });
    }
    return next(
      new HttpException(HTTPCodes.SERVER_ERROR, "Couldn't add employee.")
    );
  }),
};

export default UserController;
