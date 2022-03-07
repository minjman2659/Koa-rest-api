export interface IPostBody {
  title: string;
  content: string;
  thumbnail: string;
}

export interface IPost extends IPostBody {
  id?: string;
  fkUserId: string;
}
