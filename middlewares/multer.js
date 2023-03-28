import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Images');
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// ^ Verify if the file is of one of the following types (png, jpg, jpeg, pdf)
const allowedTypes = ['pdf', 'png', 'jpeg', 'jpg'];

const multerFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype.split('/')[1])) cb(null, true);
  else
    cb(
      new Error('Not valid file type, allowed types(png, jpg, jpeg, pdf)'),
      false
    );
};

export const upload = multer({ storage, fileFilter: multerFilter });
