import { nanoid } from 'nanoid';
import * as crypto from 'crypto';
import db from 'database';

import { randomEmail } from 'test/helper';
const { User } = db;
const { PASSWORD_SALT } = process.env;

function hash(password: string): string {
  return crypto
    .createHmac('sha512', PASSWORD_SALT)
    .update(password)
    .digest('hex');
}

const makeRaw = () => {
  const payload = {
    email: `${randomEmail()}`,
    username: `${nanoid(5)}`,
    password: 'password',
  };

  const buildPayload = {
    email: `${randomEmail()}`,
    username: `${nanoid(5)}`,
    password: hash(payload.password),
  };

  return { payload, buildPayload };
};

const mockUser = async () => {
  try {
    const { payload, buildPayload } = makeRaw();
    const user = await User.build(buildPayload).save();

    return { user, payload, buildPayload };
  } catch (err) {
    throw new Error(err);
  }
};

export default mockUser;
