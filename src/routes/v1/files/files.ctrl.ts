import { Context } from 'koa';

import fileUpload from 'lib/file-upload';

export default class FileCtrl {
  static uploadImage = async (ctx: Context) => {
    // 클라에서의 요청이 <input type='file' name='file'> 일 때,
    const { file } = ctx.request.files;
    if (!file) {
      ctx.status = 400;
      ctx.body = 'NO_IMAGEFILE';
      return;
    }

    const fileObj = JSON.parse(JSON.stringify(file));
    const { type, size, path, name } = fileObj;

    const imageRegex = /^image\/(.*?)/;
    if (!imageRegex.test(type)) {
      ctx.status = 400;
      ctx.body = 'UNACCEPTABLE_FILE_EXTENSIONS';
      return;
    }
    // 10MB 제한
    if (size > 1024 * 1024 * 10) {
      ctx.status = 413;
      ctx.body = 'FILE_IS_TOO_LARGE';
      return;
    }

    fileUpload(name, path);

    ctx.status = 201;
  };
}
