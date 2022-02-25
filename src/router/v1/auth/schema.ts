import * as Joi from 'joi';

export const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const registerSchema = loginSchema.append({
  username: Joi.string().required(),
});

export const emailSchema = Joi.object().keys({
  email: Joi.string().email().required(),
});
