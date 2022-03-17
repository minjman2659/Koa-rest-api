import * as Joi from 'joi';

export const createAndUpdateSchema = Joi.object().keys({
  title: Joi.string().required(),
  content: Joi.string().required(),
  thumbnail: Joi.string().required(),
});

export const getQuerySchema = Joi.object().keys({
  page: Joi.number().integer().min(1).required(),
  limit: Joi.number().integer().min(1).required(),
});
