import { Context } from 'koa';
import * as httpMocks from 'node-mocks-http';

import db from 'database';
import AuthCtrl from './auth.ctrl';

import { mockUser } from 'test/mock';
const { User } = db;
const { register, checkEmail, login, logout } = AuthCtrl;

let ctx: Context = null;
let next = null;

User.findOne = null;
User.register = null;
User.checkEmail = null;

beforeEach(() => {
  User.findOne = jest.fn();
  User.register = jest.fn();
  ctx.request = httpMocks.createRequest() as any;
  ctx.response = httpMocks.createResponse() as any;
  next = jest.fn();
});

describe('/api/v1/auth', () => {
    describe('[POST] /register', () => {
        let existedUser: any = null;
        beforeEach(async() => {
            const {payload, user} = await mockUser();
            existedUser = user;
            ctx.request.body = payload;
        });
        describe('[Success]', () => {
            it('should have a register function', () => {
                expect(typeof register).toBe('function');
            });
            it('should return 201 status code in response', async() => {
                User.findOne = jest.fn().mockResolvedValue(null);
                User.register = jest.fn().mockResolvedValue(existedUser);
                await register(ctx);
                expect(ctx.status).toBe(201);
                expect(ctx.response_isEndCalled()).toBe(true);
            })
        })
    });
})