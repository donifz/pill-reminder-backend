import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class FileUploadService {
  private readonly uploadsDir: string;
  private readonly categoryIconsDir: string;
  private readonly doctorPhotosDir: string;

  constructor() {
    // Use absolute paths
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this.categoryIconsDir = path.join(this.uploadsDir, 'categories');
    this.doctorPhotosDir = path.join(this.uploadsDir, 'doctors');

    // Ensure upload directories exist
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist() {
    [this.uploadsDir, this.categoryIconsDir, this.doctorPhotosDir].forEach(
      (dir) => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      },
    );
  }

  async uploadCategoryIcon(file: Express.Multer.File): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
    const filePath = path.join(this.categoryIconsDir, fileName);

    // Write file to disk
    await fs.promises.writeFile(filePath, file.buffer);

    // Return the relative path that will be stored in the database
    return `/assets/categories/${fileName}`;
  }

  async uploadDoctorPhoto(file: Express.Multer.File): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
    const filePath = path.join(this.doctorPhotosDir, fileName);

    // Write file to disk
    await fs.promises.writeFile(filePath, file.buffer);

    // Return the relative path that will be stored in the database
    return `/assets/doctors/${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      if (!fileUrl) return;

      const fileName = path.basename(fileUrl);
      let filePath: string;

      if (fileUrl.includes('/assets/categories/')) {
        filePath = path.join(this.categoryIconsDir, fileName);
      } else if (fileUrl.includes('/assets/doctors/')) {
        filePath = path.join(this.doctorPhotosDir, fileName);
      } else {
        return;
      }

      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      // Don't throw error as this is not critical
    }
  }
}
