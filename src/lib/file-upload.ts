import * as fs from 'fs';
import * as path from 'path';

import imagesDir from 'lib/images-dir';
import { getToday, filenameToRes } from 'lib/utils';

const fileUpload = (filename: string, filepath: string): void => {
  const reader = fs.createReadStream(filepath);
  const beforeFilename = getToday() + filename;
  const stream = fs.createWriteStream(
    path.join(imagesDir, filenameToRes(beforeFilename)),
  );
  reader.pipe(stream);
};

export default fileUpload;
