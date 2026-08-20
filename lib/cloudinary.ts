import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  options: {
    folder: string;
    resource_type?: 'image' | 'video' | 'raw' | 'auto';
    public_id?: string;
    transformation?: object[];
  }
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `agromia/${options.folder}`,
        resource_type: options.resource_type || 'auto',
        public_id: options.public_id,
        transformation: options.transformation,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
        } else {
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
}
