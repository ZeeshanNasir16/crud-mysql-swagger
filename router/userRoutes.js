import express from 'express';
import UserController from '../controlller/UserController.js';
import { protect } from '../middlewares/protect.js';
import validationMiddleware from '../middlewares/validationMiddleware.js';
import {
  addEmployeeSchema,
  updateEmpSchema,
  loginSchema,
  signUpSchema,
} from '../validations/userValidations.js';

const UserRouter = express.Router();

UserRouter.get('/getMe', protect, UserController.getMe);

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

export default UserRouter;
