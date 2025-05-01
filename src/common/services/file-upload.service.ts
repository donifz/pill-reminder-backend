import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class FileUploadService {
  private readonly uploadsDir = 'uploads';
  private readonly categoryIconsDir = 'uploads/categories';
  private readonly doctorPhotosDir = 'uploads/doctors';

  constructor() {
    // Ensure upload directories exist
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir);
    }
    if (!fs.existsSync(this.categoryIconsDir)) {
      fs.mkdirSync(this.categoryIconsDir);
    }
    if (!fs.existsSync(this.doctorPhotosDir)) {
      fs.mkdirSync(this.doctorPhotosDir);
    }
  }

  async uploadCategoryIcon(file: Express.Multer.File): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
    const filePath = path.join(this.categoryIconsDir, fileName);

    // Write file to disk
    await fs.promises.writeFile(filePath, file.buffer);

    // Return the relative path that will be stored in the database
    return `/assets/icons/categories/${fileName}`;
  }

  async uploadDoctorPhoto(file: Express.Multer.File): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
    const filePath = path.join(this.doctorPhotosDir, fileName);

    // Write file to disk
    await fs.promises.writeFile(filePath, file.buffer);

    // Return the relative path that will be stored in the database
    return `/assets/photos/doctors/${fileName}`;
  }

  async deleteCategoryIcon(iconUrl: string): Promise<void> {
    if (!iconUrl) return;

    const fileName = path.basename(iconUrl);
    const filePath = path.join(this.categoryIconsDir, fileName);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  async deleteDoctorPhoto(photoUrl: string): Promise<void> {
    if (!photoUrl) return;

    const fileName = path.basename(photoUrl);
    const filePath = path.join(this.doctorPhotosDir, fileName);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
} 