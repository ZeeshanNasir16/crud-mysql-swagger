import catchAsync from '../utils/catchAsync.js';
import CryptoJS from 'crypto-js';
import { HTTPCodes } from '../utils/responses.js';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import HttpException from '../utils/httpException.js';
import logger from '../utils/logger.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  logger.info(token);
  if (!token) {
    return next(
      new HttpException(HTTPCodes.NOT_AUTHORIZED, `you are not login`)
    );
  }

  // 2- validate the token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //   const deocde = jwt.verify(token, process.env.JWT_SECRET);
  console.table(decode);
  //  Decrypt Payload from token
  const bytes = CryptoJS.AES.decrypt(decode.data, process.env.JWT_SECRET);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  console.table(decode);
  //   logger.info(`decoded, ${decode}`);
  //   logger.info(`orignal, ${originalText}`);

  // 3- check user exits
  //   return decode.id;
  //   const currentUser = await User.findById(decode.id);
  //   if (!currentUser) {
  //     return next(
  //       new AppError('User belong to this token does not exists ', 401)
  //     );
  //   }

  req.id = originalText;
  next();
});
