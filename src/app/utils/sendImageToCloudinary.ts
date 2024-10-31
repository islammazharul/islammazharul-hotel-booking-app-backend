// import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import cloudinary from 'cloudinary';
// import config from '../config';
import fs from 'fs';
import multer from 'multer';

// cloudinary.config({
//   cloud_name: config.cloud_name,
//   api_key: config.api_key,
//   api_secret: config.api_secret,
// });

export async function sendImageToCloudinary(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles?.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString('base64');
    let dataURI = 'data:' + image.mimetype + ';base64,' + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// export const sendImageToCloudinary = (
//   imageName: string,
//   path: string,
// ): Promise<Record<string, unknown>> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       path,
//       { public_id: imageName.trim() },
//       function (error, result) {
//         if (error) {
//           reject(error);
//         }
//         resolve(result as UploadApiResponse);
//         // delete a file asynchronously
//         fs.unlink(path, (err) => {
//           if (err) {
//             console.log(err);
//           } else {
//             console.log('File is deleted.');
//           }
//         });
//       },
//     );
//   });
// };

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, process.cwd() + '/uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix);
//   },
// });

// export const upload = multer({ storage: storage });
