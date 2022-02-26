import { Context } from 'koa';
import * as Joi from 'joi';
import db from 'database';

import { createAndUpdateSchema, getQuerySchema } from './schema';
const { Post, User } = db;

interface IPostBody {
  title: string;
  content: string;
  thumbnail: string;
}

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
        fkUserId: userId,
      });
    } catch (err) {
      ctx.throw(500, err);
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
        attributes: { exclude: ['fkUserId'] },
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
      ctx.throw(500, err);
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
        attributes: { exclude: ['fkUserId'] },
        include: [
          {
            model: User,
            as: 'writer',
            attributes: ['id', 'username', 'email'],
          },
        ],
      });
    } catch (err) {
      ctx.throw(500, err);
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
        where: { id: postId, fkUserId: userId },
      });
    } catch (err) {
      ctx.throw(500, err);
    }

    if (!post) {
      ctx.status = 404;
      ctx.body = 'NOT_FOUND_POST'; // Post가 없거나, 내가 작성한 Post가 아닐 경우,
      return;
    }

    try {
      post.title = title;
      post.content = content;
      post.thumbnail = thumbnail;
      await post.save();
      ctx.status = 200;
    } catch (err) {
      ctx.throw(500, err);
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
        where: { id: postId, fkUserId: userId },
      });
    } catch (err) {
      ctx.throw(500, err);
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
      ctx.throw(500, err);
    }
  };
}
