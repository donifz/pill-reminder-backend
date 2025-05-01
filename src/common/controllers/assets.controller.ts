import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('assets')
export class AssetsController {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads');

  @Get('categories/:filename')
  async serveCategory(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(this.uploadsDir, 'categories', filename);
    console.log('Attempting to serve file:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.log('File not found:', filePath);
      throw new NotFoundException(`File ${filename} not found`);
    }

    return res.sendFile(filePath);
  }

  @Get('doctors/:filename')
  async serveDoctor(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(this.uploadsDir, 'doctors', filename);
    console.log('Attempting to serve file:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.log('File not found:', filePath);
      throw new NotFoundException(`File ${filename} not found`);
    }

    return res.sendFile(filePath);
  }
} 