import db from 'database';
import mockUser from './user';

import { IPostBody } from 'types/post';

const { Post } = db;

const { API_HOST } = process.env;

const mockPost = async () => {
  const payload: IPostBody = {
    title: 'title',
    thumbnail: `${API_HOST}/images/image_1.jpg`,
    content: 'content',
  };

  try {
    const { user } = await mockUser();
    const post = await Post.build({
      ...payload,
      userId: user.id,
    }).save();

    return { user, post, payload };
  } catch (err) {
    throw new Error(err);
  }
};

export default mockPost;
