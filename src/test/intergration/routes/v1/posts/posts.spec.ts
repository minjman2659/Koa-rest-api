import * as request from 'supertest';
import * as http from 'http';

import Server from 'server';
import { IPostBody } from 'types/post';
import { IRegisterBody } from 'types/user';
import { mockPost } from 'test/mock';
import { generateToken, validateSchema } from 'test/helper';
import { getPostSchema, getPostListSchema } from './schema';

const server = new Server();
const { app } = server;
const appTest = request(http.createServer(app.callback()));

interface IPost extends IPostBody {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUser extends IRegisterBody {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

describe('/api/v1/posts', () => {
  let payload: IPostBody = null;
  let user: IUser = null;
  let post: IPost = null;
  beforeEach(async () => {
    const mock = await mockPost();
    payload = mock.payload;
    user = mock.user;
    post = mock.post;
  });
  it('[POST] /', async () => {
    const { token } = await generateToken(user.email);
    const { statusCode } = await appTest
      .post('/api/v1/posts')
      .send(payload)
      .set('Cookie', token);

    expect(statusCode).toBe(201);
  });
  it('[GET] ?page=&limit=', async () => {
    const { statusCode, body } = await appTest
      .get('/api/v1/posts')
      .query({ page: 1, limit: 10 });

    expect(validateSchema(getPostListSchema, body)).toBe(true);
    expect(statusCode).toBe(200);
  });
  it('[GET] /:postId', async () => {
    const { statusCode, body } = await appTest.get(`/api/v1/posts/${post.id}`);

    expect(validateSchema(getPostSchema, body)).toBe(true);
    expect(statusCode).toBe(200);
  });
  it('[PATCH] /:postId', async () => {
    const { token } = await generateToken(user.email);
    const { statusCode } = await appTest
      .patch(`/api/v1/posts/${post.id}`)
      .send(payload)
      .set('Cookie', token);

    expect(statusCode).toBe(200);
  });
  it('[DELETE] /:postId', async () => {
    const { token } = await generateToken(user.email);
    const { statusCode } = await appTest
      .delete(`/api/v1/posts/${post.id}`)
      .set('Cookie', token);

    expect(statusCode).toBe(200);
  });
});
