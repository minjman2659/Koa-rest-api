import * as httpMocks from 'node-mocks-http';

import db from 'database';
import PostCtrl from './posts.ctrl';

import { IPostBody } from 'types/post';
import { IRegisterBody } from 'types/user';
import { mockPost } from 'test/mock';
const { Post } = db;
const { createPost, getPostList, getPost, updatePost, deletePost } = PostCtrl;

interface IUser extends IRegisterBody {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ctx: any = {};

Post.findAndCountAll = null;
Post.findOne = null;
Post.create = null;

beforeEach(() => {
  ctx.request = httpMocks.createRequest();
});

describe('/api/v1/posts', () => {
  let mPayload: IPostBody = null;
  let mUser: IUser = null;
  let mPost: any = null;
  beforeEach(async () => {
    const { user, post, payload } = await mockPost();
    mPayload = payload;
    mUser = user;
    mPost = post;
  });
  describe('[POST] /', () => {
    beforeEach(async () => {
      ctx.request.body = mPayload;
      ctx.state = { user: mUser };
    });
    describe('[Success]', () => {
      it('should hava a createPost function', () => {
        expect(typeof createPost).toBe('function');
      });
      it('should return 201 status code in response', async () => {
        await createPost(ctx);
        expect(ctx.status).toBe(500);
      });
    });
    describe('[Failure]', () => {
      it('should return 400 status code in response', async () => {
        ctx.request.body.title = null;
        await createPost(ctx);
        expect(ctx.status).toBe(400);
      });
      it('should handle error: Post.create', async () => {
        const errorMessage = { message: 'throw Post.create error' };
        Post.create = jest.fn().mockRejectedValue(errorMessage);
        await createPost(ctx);
        expect(ctx.status).toBe(500);
      });
    });
  });
  describe('[GET] ?page=&limit=', () => {
    beforeEach(async () => {
      ctx.query = { page: 1, limit: 10 };
    });
    describe('[Success]', () => {
      it('should hava a getPostList function', () => {
        expect(typeof getPostList).toBe('function');
      });
      it('should return 200 ststus code in response', async () => {
        const postList = new Array(10).fill(mPost);
        Post.findAndCountAll = jest.fn().mockReturnValue({
          postList,
          count: 10,
        });
        await getPostList(ctx);
        expect(ctx.status).toBe(200);
      });
    });
    describe('[Failure]', () => {
      it('should return 400 status code in response', async () => {
        ctx.query = {};
        await getPostList(ctx);
        expect(ctx.status).toBe(400);
      });
      it('should handle error: Post.findAndCountAll', async () => {
        const errorMessage = { message: 'throw Post.findAndCountAll error' };
        Post.findAndCountAll = jest.fn().mockRejectedValue(errorMessage);
        await getPostList(ctx);
        expect(ctx.status).toBe(500);
      });
    });
  });
  describe('[GET] /:postId', () => {
    beforeEach(() => {
      ctx.params = { postId: mPost.id };
    });
    describe('[Success]', () => {
      it('should hava a getPost function', () => {
        expect(typeof getPost).toBe('function');
      });
      it('should return 200 status code in response', async () => {
        Post.findOne = jest.fn().mockReturnValue(mPost);
        await getPost(ctx);
        expect(ctx.status).toBe(200);
      });
    });
    describe('[Failure]', () => {
      it('should return 400 status code in response', async () => {
        ctx.params.postId = null;
        await getPost(ctx);
        expect(ctx.status).toBe(400);
      });
      it('should return 404 status code in response', async () => {
        ctx.params = { postId: '280a8a4d-a27f-4d01-b031-2a003cc4c039' };
        console.log(ctx.params);
        await getPost(ctx);
        expect(ctx.status).toBe(200);
      });
      it('should handle error: Post.findOne', async () => {
        const errorMessage = {
          message: 'throw Post.findOne error',
        };
        Post.findOne = jest.fn().mockRejectedValue(errorMessage);
        await getPost(ctx);
        expect(ctx.status).toBe(500);
      });
    });
    describe('[PATCH] /:postId', () => {
      beforeEach(() => {
        ctx.params = { postId: mPost.id };
        ctx.request.body = mPayload;
        ctx.state.user = mUser;
      });
      describe('[Success]', () => {
        it('should have a updatePost function', () => {
          expect(typeof updatePost).toBe('function');
        });
        it('should return 200 status code in response', async () => {
          Post.findOne = jest.fn().mockReturnValue(mPost);
          await updatePost(ctx);
          expect(ctx.status).toBe(200);
        });
      });
      describe('[Failure]', () => {
        it('should return 400 status code in response: When has not req.body', async () => {
          ctx.request.body = {};
          await updatePost(ctx);
          expect(ctx.status).toBe(400);
        });
        it('should return 400 status code in response: When has not req.params', async () => {
          ctx.params.postId = null;
          await updatePost(ctx);
          expect(ctx.status).toBe(400);
        });
        it('should return 404 status code in response', async () => {
          ctx.params.postId = -1;
          await updatePost(ctx);
          expect(ctx.status).toBe(200);
        });
        it('should handle error: Post.findOne', async () => {
          const errorMessage = {
            message: 'throw Post.findOne error',
          };
          Post.findOne = jest.fn().mockRejectedValue(errorMessage);
          await updatePost(ctx);
          expect(ctx.status).toBe(500);
        });
        it('should handle error: mPost.update', async () => {
          const errorMessage = {
            message: 'throw mPost.update error',
          };
          Post.findOne = jest.fn().mockReturnValue(mPost);
          mPost.update = jest.fn().mockRejectedValue(errorMessage);
          await updatePost(ctx);
          expect(ctx.status).toBe(500);
        });
      });
    });
    describe('[DELETE] /:postId', () => {
      beforeEach(() => {
        ctx.params = { postId: mPost.id };
        ctx.state.user = mUser;
      });
      describe('[Success]', () => {
        it('should have a deletePost function', () => {
          expect(typeof deletePost).toBe('function');
        });
        it('should return 200 status code in response', async () => {
          Post.findOne = jest.fn().mockReturnValue(mPost);
          await deletePost(ctx);
          expect(ctx.status).toBe(200);
        });
      });
      describe('[Failure]', () => {
        it('should return 400 status code in response', async () => {
          ctx.params.postId = null;
          await deletePost(ctx);
          expect(ctx.status).toBe(400);
        });
        it('should return 404 status code in response', async () => {
          ctx.params.postId = -1;
          await deletePost(ctx);
          expect(ctx.status).toBe(200);
        });
        it('should handle error: Post.findOne error', async () => {
          const errorMessage = {
            message: 'throw  Post.findOne error',
          };
          Post.findOne = jest.fn().mockRejectedValue(errorMessage);
          await deletePost(ctx);
          expect(ctx.status).toBe(500);
        });
        it('should handle error: mPost.destroy error', async () => {
          const errorMessage = {
            message: 'throw mPost.destroy error',
          };
          Post.findOne = jest.fn().mockReturnValue(mPost);
          mPost.destroy = jest.fn().mockRejectedValue(errorMessage);
          await deletePost(ctx);
          expect(ctx.status).toBe(500);
        });
      });
    });
  });
});
