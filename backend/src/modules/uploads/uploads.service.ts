import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = 'presec-ghana',
  ): Promise<{ url: string; publicId: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG, WEBP, and GIF images are allowed',
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be under 5MB');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            this.logger.error('Cloudinary upload failed', error);
            return reject(
              new BadRequestException('Failed to upload image'),
            );
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadDocument(
    file: Express.Multer.File,
    folder = 'presec-ghana/documents',
  ): Promise<{ url: string; publicId: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Only PDF and DOC/DOCX are allowed');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be under 10MB');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'raw',
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            this.logger.error('Cloudinary document upload failed', error);
            return reject(
              new BadRequestException('Failed to upload document'),
            );
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async delete(publicId: string): Promise<void> {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      this.logger.warn(`Failed to delete ${publicId}`, err);
    }
  }
}
