import * as request from 'supertest';

import Server from 'server';
import { mockUser } from 'test/mock';
import { generateToken, validateSchema } from 'test/helper';
import loginSchema from './schema';

interface IMockPayload {
  email: string;
  username: string;
  password: string;
}

interface IUser extends IMockPayload {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

describe('/api/v1/auth', () => {
  let payload: IMockPayload = null;
  let user: IUser = null;
  beforeEach(async () => {
    const mock = await mockUser();
    payload = mock.payload;
    user = mock.user;
  });
  it('[POST] /register', async () => {
    const { statusCode } = await request(Server)
      .post('/api/v1/auth/register')
      .send(payload);

    expect(statusCode).toBe(201);
  });
  it('[GET] /checkEmail/:email', async () => {
    const { email } = user;
    const { statusCode } = await request(Server).get(
      `/api/v1/auth/checkEmail/${email}`,
    );

    expect(statusCode).toBe(200);
  });
  it('[POST] /login', async () => {
    const { email } = user;
    const { statusCode, body } = await request(Server)
      .post('/api/v1/auth/login')
      .send({ email, password: 'password' });

    expect(validateSchema(loginSchema, body));
    expect(statusCode).toBe(200);
  });
  it('[POST] /logout', async () => {
    const { token } = await generateToken(user.email);
    const { statusCode } = await request(Server)
      .post('/api/v1/auth/logout')
      .set('Cookie', token);

    expect(statusCode).toBe(200);
  });
});
