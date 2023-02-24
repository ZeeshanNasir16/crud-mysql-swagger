import express from 'express';
import UserController from '../controlller/UserController.js';
import validationMiddleware from '../middlewares/validationMiddleware.js';
import {
  addEmployeeSchema,
  updateEmpSchema,
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

export default UserRouter;
