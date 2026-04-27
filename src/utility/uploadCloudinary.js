import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';

export const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'auto',
                transformation: [
                    { width: 500, height: 500, crop: 'limit' },
                    { quality: 'auto' },
                    { format: 'auto' }
                ],
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};