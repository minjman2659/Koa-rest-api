import * as httpMocks from 'node-mocks-http';

import db from 'database';
import UserCtrl from './users.ctrl';

import { mockUser } from 'test/mock';
const { User } = db;
const { getUser } = UserCtrl;

const ctx: any = {};

User.findByPk = null;

beforeEach(() => {
  ctx.request = httpMocks.createRequest();
});

describe('/api/v1/users', () => {
  describe('[GET] /:userId', () => {
    let existedUser: any = null;
    beforeEach(async () => {
      const { user } = await mockUser();
      existedUser = user;
      ctx.params = { userId: user.id };
    });
    describe('[Success]', () => {
      it('should have a getUser function', () => {
        expect(typeof getUser).toBe('function');
      });
      it('should return 200 status code in response', async () => {
        User.findByPk = jest.fn().mockResolvedValue(existedUser);
        await getUser(ctx);
        expect(ctx.status).toBe(200);
      });
    });
    describe('[Failure]', () => {
      it('should return 400 status code in response', async () => {
        ctx.params = { userId: null };
        await getUser(ctx);
        expect(ctx.status).toBe(400);
      });
      it('should return 409 status code in response', async () => {
        User.findByPk = jest.fn().mockResolvedValue(null);
        await getUser(ctx);
        expect(ctx.status).toBe(404);
      });
      it('should handle error: User.findByPk', async () => {
        const errorMessage = { message: 'throw User.findByPk error' };
        User.findByPk = jest.fn().mockRejectedValue(errorMessage);
        await getUser(ctx);
        expect(ctx.status).toBe(500);
      });
    });
  });
});
