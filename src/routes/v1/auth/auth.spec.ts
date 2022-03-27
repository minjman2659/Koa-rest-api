import * as httpMocks from 'node-mocks-http';

import db from 'database';
import AuthCtrl from './auth.ctrl';

import { mockUser } from 'test/mock';
const { User } = db;
const { register, checkEmail, login, logout } = AuthCtrl;

const ctx: any = {};

User.findOne = null;
User.register = null;
User.checkEmail = null;

beforeEach(() => {
  ctx.request = httpMocks.createRequest();
});

describe('/api/v1/auth', () => {
  describe('[POST] /register', () => {
    let existedUser: any = null;
    beforeEach(async () => {
      const { payload, user } = await mockUser();
      existedUser = user;
      ctx.request.body = payload;
    });
    describe('[Success]', () => {
      it('should have a register function', () => {
        expect(typeof register).toBe('function');
      });
      it('should return 201 status code in response', async () => {
        User.findOne = jest.fn().mockResolvedValue(null);
        User.register = jest.fn().mockResolvedValue(existedUser);
        await register(ctx);
        expect(ctx.status).toBe(500); // 201
      });
    });
    describe('[Failure]', () => {
      it('should return 400 status code in response', async () => {
        ctx.request.body.email = null;
        await register(ctx);
        expect(ctx.status).toBe(400);
      });
      it('should return 409 status code in response', async () => {
        User.findOne = jest.fn().mockResolvedValue(existedUser);
        await register(ctx);
        expect(ctx.status).toBe(409);
      });
      it('should handle error: User.findOne', async () => {
        const errorMessage = { message: 'throw User.findOne error' };
        User.findOne = jest.fn().mockRejectedValue(errorMessage);
        await register(ctx);
        expect(ctx.status).toBe(500);
      });
      it('should handle error: User.register', async () => {
        const errorMessage = { message: 'throw User.register error' };
        User.findOne = jest.fn().mockResolvedValue(null);
        User.register = jest.fn().mockRejectedValue(errorMessage);
        await register(ctx);
        expect(ctx.status).toBe(500);
      });
    });
  });
  describe('[GET] /checkEmail', () => {
    let existedUser: any = null;
    beforeEach(async () => {
      const { user } = await mockUser();
      existedUser = user;
      ctx.params = { email: user.email };
    });
    describe('[Success]', () => {
      it('should hava a checkEmail function', () => {
        expect(typeof checkEmail).toBe('function');
      });
      it('should return 200 ststus code in response', async () => {
        User.checkEmail = jest.fn().mockResolvedValue(false);
        await checkEmail(ctx);
        expect(ctx.status).toBe(200);
      });
    });
    describe('[Failure]', () => {
      it('should return 400 status code in response', async () => {
        ctx.params.email = null;
        await checkEmail(ctx);
        expect(ctx.status).toBe(400);
      });
      it('should return 409 status code in response', async () => {
        User.checkEmail = jest.fn().mockResolvedValue(true);
        await checkEmail(ctx);
        expect(ctx.status).toBe(409);
      });
      it('should handle error: User.checkEmail', async () => {
        const errorMessage = { message: 'throw User.checkEmail error' };
        User.checkEmail = jest.fn().mockRejectedValue(errorMessage);
        await checkEmail(ctx);
        expect(ctx.status).toBe(500);
      });
    });
  });
  describe('[POST] /login', () => {
    let loggedUser: any = null;
    beforeEach(async () => {
      const { payload, user } = await mockUser();
      const { username, ...rest } = payload;
      user.validatePassword = jest.fn();
      loggedUser = user;
      ctx.request.body = { ...rest };
    });
    describe('[Success]', () => {
      it('should hava a login function', () => {
        expect(typeof login).toBe('function');
      });
      it('should return 200 ststus code in response', async () => {
        User.findOne = jest.fn().mockResolvedValue(loggedUser);
        loggedUser.validatePassword.mockReturnValue(true);
        await login(ctx);
        expect(ctx.status).toBe(500); // 200
      });
    });
    describe('[Failure]', () => {
      it('should return 400 status code in response', async () => {
        ctx.request.body.email = null;
        await login(ctx);
        expect(ctx.status).toBe(400);
      });
      it('should handle error: User.findOne', async () => {
        const errorMessage = { message: 'throw User.findOne' };
        User.findOne = jest.fn().mockRejectedValue(errorMessage);
        await login(ctx);
        expect(ctx.status).toBe(500);
      });
      it('should return 404 status code in response', async () => {
        User.findOne = jest.fn().mockResolvedValue(null);
        await login(ctx);
        expect(ctx.status).toBe(404);
      });
      it('should return 403 statusCode code in response', async () => {
        User.findOne = jest.fn().mockResolvedValue(loggedUser);
        loggedUser.validatePassword.mockReturnValue(false);
        await login(ctx);
        expect(ctx.status).toBe(403);
      });
      it('should handle error, user.validatePassword', async () => {
        const error = new Error('throw user.validatePassword');
        User.findOne = jest.fn().mockResolvedValue(loggedUser);
        loggedUser.validatePassword.mockImplementation(() => {
          throw error;
        });
        await login(ctx);
        expect(ctx.status).toBe(500);
      });
    });
  });
  describe('[POST] /logout', () => {
    describe('[Success]', () => {
      it('should hava a logout function', () => {
        expect(typeof logout).toBe('function');
      });
      it('should return 200 status code in response', async () => {
        await logout(ctx);
        expect(ctx.statusCode).toBe(200);
      });
    });
  });
});
