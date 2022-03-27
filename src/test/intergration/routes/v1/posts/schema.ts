import * as Joi from 'joi';

export const getPostSchema = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string().min(2).max(20).required(),
  content: Joi.string().max(2000).required(),
  thumbnail: Joi.string().required(),
  updatedAt: Joi.date().required(),
  createdAt: Joi.date().required(),
  writer: Joi.object().keys({
    id: Joi.string().required(),
    username: Joi.string().min(0).max(10).required(),
    email: Joi.string().email().required(),
  }),
});

export const getPostListSchema = Joi.object().keys({
  postList: Joi.array().items(getPostSchema.append()),
  count: Joi.number().integer().required(),
});
