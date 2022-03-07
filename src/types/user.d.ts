export interface ILoginBody {
  email: string;
  password: string;
}

export interface IRegisterBody extends ILoginBody {
  username: string;
}

export interface IUser extends IRegisterBody {
  id?: string;
  transaction?: any;
}
