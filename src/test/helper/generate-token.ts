import * as request from 'supertest';
import Server from 'server';
import db from 'database';

const { User } = db;

async function generateToken(email: string) {
  if (!email) return;
  try {
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      throw new Error('NO_USER');
    }

    const loggedInfo = await request(Server)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: 'password' });
    const token = loggedInfo.headers['set-cookie'][0];
    return { token, user };
  } catch (err) {
    throw new Error(err);
  }
}

export default generateToken;
