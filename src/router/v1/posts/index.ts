import * as Router from 'koa-router';
import checkAuth from 'middleware/check-auth';

import PostCtrl from './posts.ctrl';

class PostRouter {
  public posts: Router;

  constructor() {
    this.posts = new Router();
    this.routes();
  }

  public routes = () => {
    const { posts } = this;
    posts.post('/', checkAuth, PostCtrl.createPost);
    posts.get('/', PostCtrl.getPostList);
    posts.get('/:postId', PostCtrl.getPost);
    posts.patch('/:postId', checkAuth, PostCtrl.updatePost);
    posts.delete('/:postId', checkAuth, PostCtrl.deletePost);
  };
}

const postRouter = new PostRouter();
const posts = postRouter.posts;

export default posts;
