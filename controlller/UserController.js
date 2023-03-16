import { UserModel } from '../model/UserModel.js';
import catchAsync from '../utils/catchAsync.js';
import HttpException from '../utils/httpException.js';
import logger from '../utils/logger.js';
import { HTTPCodes } from '../utils/responses.js';
import transporter from '../utils/SendMail.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

const signToken = async (id) => {
  const encryptData = CryptoJS.AES.encrypt(
    `${id}`,
    process.env.JWT_SECRET
  ).toString();

  return jwt.sign({ data: encryptData }, process.env.JWT_SECRET, {
    expiresIn: '2h',
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
  getMe: catchAsync(async (req, res, next) => {
    logger.info(`User Id : ${req.id}`);
    const user = await UserModel.getById(req.id);
    console.table('user', user);

    if (!user)
      return res.status(HTTPCodes.NOT_FOUND).json({
        status: 'not found',
        message: 'User associated with this token does not exists',
      });

    res.status(HTTPCodes.OK).json({
      status: 'successs',
      user,
    });
  }),
  login: catchAsync(async (req, res, next) => {
    const [emp] = await UserModel.login(req.body.email);

    if (!emp || emp.length === 0) {
      return res.status(HTTPCodes.NOT_FOUND).json({
        status: 'success',
        message: 'User not found with this email.',
      });
    }

    const chk_password = bcrypt.compareSync(req.body.password, emp.password);

    if (chk_password) {
      const token = await signToken(emp.id);
      res.set('Authorization', `Bearer ${token}`);
      res.set('Access-Control-Expose-Headers', 'Authorization');
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
      res.set('Access-Control-Expose-Headers', 'Authorization');
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
