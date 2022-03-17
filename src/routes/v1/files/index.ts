import * as Router from 'koa-router';
import { checkAuth } from 'middleware';

import FileCtrl from './files.ctrl';

class FileRouter {
  public files: Router;

  constructor() {
    this.files = new Router();
    this.routes();
  }

  public routes = () => {
    const { files } = this;
    files.post('/', checkAuth, FileCtrl.uploadImage);
  };
}

const fileRouter = new FileRouter();
const files = fileRouter.files;

export default files;
