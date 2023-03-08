import Joi from 'joi';

export const addEmployeeSchema = Joi.object({
  fullname: Joi.string().max(60).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  salary: Joi.number().min(500).required(),
  role: Joi.string().min(3).required(),
  address: Joi.string(),
});

export const updateEmpSchema = Joi.object({
  fullname: Joi.string().max(60),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  salary: Joi.number().min(500),
  role: Joi.string().min(3),
  address: Joi.string(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' }),
  fullname: Joi.string().max(60).required(),
  cnic: Joi.number(),
});
