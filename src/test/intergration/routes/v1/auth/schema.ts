import * as Joi from 'joi';

const loginSchema = Joi.object().keys({
  id: Joi.string().required(),
  username: Joi.string().min(0).max(10).required(),
  email: Joi.string().email().required(),
  updatedAt: Joi.date().required(),
  createdAt: Joi.date().required(),
});

export default loginSchema;
