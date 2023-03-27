import express from 'express';
import UserController from '../controlller/UserController.js';
import validationMiddleware from '../middlewares/validationMiddleware.js';
import {
  addEmployeeSchema,
  updateEmpSchema,
  loginSchema,
  signUpSchema,
  forgotPassword,
  resetPassword,
} from '../validations/userValidations.js';

const UserRouter = express.Router();

UserRouter.get('/', UserController.getAll);
UserRouter.get('/:id', UserController.getOne);
UserRouter.post(
  '/',
  validationMiddleware(addEmployeeSchema),
  UserController.create
);

UserRouter.patch(
  '/:id',
  validationMiddleware(updateEmpSchema),
  UserController.update
);
UserRouter.delete('/:id', UserController.delete);

UserRouter.post(
  '/login',
  validationMiddleware(loginSchema),
  UserController.login
);
UserRouter.post(
  '/signup',
  validationMiddleware(signUpSchema),
  UserController.signup
);
UserRouter.post(
  '/forgotPassword/',
  validationMiddleware(forgotPassword),
  UserController.forgotPassword
);
UserRouter.patch(
  '/resetpassword/:token',
  validationMiddleware(resetPassword),
  UserController.resetPassword
);

export default UserRouter;
