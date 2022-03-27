import { Context } from 'koa';
import * as Joi from 'joi';
import db from 'database';

import { createAndUpdateSchema, getQuerySchema } from './schema';
import { IPostBody } from 'types/post';
const { Post, User } = db;

export default class PostCtrl {
  static createPost = async (ctx: Context) => {
    const result: Joi.ValidationResult<string> = createAndUpdateSchema.validate(
      ctx.request.body,
    );
    if (result.error) {
      ctx.status = 400;
      ctx.body = result.error.details[0].message;
      return;
    }

    const { title, content, thumbnail }: IPostBody = ctx.request.body;

    const { id: userId } = ctx.state.user;

    try {
      await Post.create({
        title,
        content,
        thumbnail,
        userId,
      });
    } catch (err) {
      ctx.status = 500;
      ctx.body = err.message;
      return;
    }

    ctx.status = 201;
  };

  static getPostList = async (ctx: Context) => {
    const result: Joi.ValidationResult<string> = getQuerySchema.validate(
      ctx.query,
    );
    if (result.error) {
      ctx.status = 400;
      ctx.body = result.error.details[0].message;
      return;
    }

    const { page, limit } = ctx.query;

    const offset = (Number(page) - 1) * Number(limit);
    try {
      const { rows, count } = await Post.findAndCountAll({
        offset,
        limit: Number(limit),
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['userId'] },
        include: [
          {
            model: User,
            as: 'writer',
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      const result = {
        postList: rows,
        count,
      };

      ctx.status = 200;
      ctx.body = result;
    } catch (err) {
      ctx.status = 500;
      ctx.body = err.message;
      return;
    }
  };

  static getPost = async (ctx: Context) => {
    const { postId } = ctx.params;
    if (!postId) {
      ctx.status = 400;
      ctx.body = 'BAD_REQUEST';
      return;
    }

    let post = null;
    try {
      post = await Post.findOne({
        where: { id: postId },
        attributes: { exclude: ['userId'] },
        include: [
          {
            model: User,
            as: 'writer',
            attributes: ['id', 'username', 'email'],
          },
        ],
      });
    } catch (err) {
      ctx.status = 500;
      ctx.body = err.message;
      return;
    }

    if (!post) {
      ctx.status = 404;
      ctx.body = 'NOT_FOUND_POST';
      return;
    }

    ctx.status = 200;
    ctx.body = post;
  };

  static updatePost = async (ctx: Context) => {
    const { postId } = ctx.params;
    if (!postId) {
      ctx.status = 400;
      ctx.body = 'BAD_REQUEST';
      return;
    }

    const result: Joi.ValidationResult<string> = createAndUpdateSchema.validate(
      ctx.request.body,
    );
    if (result.error) {
      ctx.status = 400;
      ctx.body = result.error.details[0].message;
      return;
    }

    const { title, content, thumbnail }: IPostBody = ctx.request.body;

    const { id: userId } = ctx.state.user;

    let post = null;
    try {
      post = await Post.findOne({
        where: { id: postId, userId },
      });
    } catch (err) {
      ctx.status = 500;
      ctx.body = err.message;
      return;
    }

    if (!post) {
      ctx.status = 404;
      ctx.body = 'NOT_FOUND_POST'; // Post가 없거나, 내가 작성한 Post가 아닐 경우,
      return;
    }

    try {
      const updateArgs = {
        title,
        content,
        thumbnail,
      };

      await post.update(updateArgs);
      ctx.status = 200;
    } catch (err) {
      ctx.status = 500;
      ctx.body = err.message;
      return;
    }
  };

  static deletePost = async (ctx: Context) => {
    const { postId } = ctx.params;
    if (!postId) {
      ctx.status = 400;
      ctx.body = 'BAD_REQUEST';
      return;
    }

    const { id: userId } = ctx.state.user;

    let post = null;
    try {
      post = await Post.findOne({
        where: { id: postId, userId },
      });
    } catch (err) {
      ctx.status = 500;
      ctx.body = err.message;
      return;
    }

    if (!post) {
      ctx.status = 404;
      ctx.body = 'NOT_FOUND_POST'; // Post가 없거나, 내가 작성한 Post가 아닐 경우,
      return;
    }

    try {
      await post.destroy();
      ctx.status = 200;
    } catch (err) {
      ctx.status = 500;
      ctx.body = err.message;
      return;
    }
  };
}
