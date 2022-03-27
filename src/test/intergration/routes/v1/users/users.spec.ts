import * as request from 'supertest';
import * as http from 'http';

import Server from 'server';
import { IRegisterBody } from 'types/user';
import { mockUser } from 'test/mock';
import { generateToken, validateSchema } from 'test/helper';
import getUserSchema from './schema';

const server = new Server();
const { app } = server;
const appTest = request(http.createServer(app.callback()));

interface IUser extends IRegisterBody {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

describe('/api/v1/users', () => {
  let user: IUser = null;
  beforeEach(async () => {
    const mock = await mockUser();
    user = mock.user;
  });
  it('[GET] /:userId', async () => {
    const { token } = await generateToken(user.email);
    const { statusCode, body } = await appTest
      .get(`/api/v1/users/${user.id}`)
      .set('Cookie', token);

    expect(validateSchema(getUserSchema, body)).toBe(true);
    expect(statusCode).toBe(200);
  });
});
