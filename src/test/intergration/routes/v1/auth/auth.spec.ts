import * as request from 'supertest';
import * as http from 'http';

import Server from 'server';
import { IRegisterBody } from 'types/user';
import { mockUser } from 'test/mock';
import { generateToken, validateSchema } from 'test/helper';
import loginSchema from './schema';

const server = new Server();
const { app } = server;
const appTest = request(http.createServer(app.callback()));

interface IUser extends IRegisterBody {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

describe('/api/v1/auth', () => {
  let payload: IRegisterBody = null;
  let user: IUser = null;
  beforeEach(async () => {
    const mock = await mockUser();
    payload = mock.payload;
    user = mock.user;
  });
  it('[POST] /register', async () => {
    const { statusCode } = await appTest
      .post('/api/v1/auth/register')
      .send(payload);

    expect(statusCode).toBe(201);
  });
  it('[GET] /checkEmail/:email', async () => {
    const email = 'test@gmail.com';
    const { statusCode } = await appTest.get(
      `/api/v1/auth/checkEmail/${email}`,
    );

    expect(statusCode).toBe(200);
  });
  it('[POST] /login', async () => {
    const { email } = user;
    const { statusCode, body } = await appTest
      .post('/api/v1/auth/login')
      .send({ email, password: 'password' });

    expect(validateSchema(loginSchema, body));
    expect(statusCode).toBe(200);
  });
  it('[POST] /logout', async () => {
    const { token } = await generateToken(user.email);
    const { statusCode } = await appTest
      .post('/api/v1/auth/logout')
      .set('Cookie', token);

    expect(statusCode).toBe(200);
  });
});
