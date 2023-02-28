import { UserModel } from '../model/UserModel.js';
import catchAsync from '../utils/catchAsync.js';
import HttpException from '../utils/httpException.js';
import logger from '../utils/logger.js';
import { HTTPCodes } from '../utils/responses.js';
import transporter from '../utils/SendMail.js';

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
      transporter();
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
};

export default UserController;
