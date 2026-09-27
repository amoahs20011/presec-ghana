import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', example: 'profiles' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const targetFolder = folder
      ? `presec-ghana/${folder}`
      : 'presec-ghana/misc';
    return this.uploadsService.uploadImage(file, targetFolder);
  }

  @Post('document')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', example: 'heritage' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const targetFolder = folder
      ? `presec-ghana/${folder}`
      : 'presec-ghana/documents';
    return this.uploadsService.uploadDocument(file, targetFolder);
  }

  @Delete(':publicId')
  async delete(@Param('publicId') publicId: string) {
    // publicId may contain slashes (folders) — decode them
    const decoded = decodeURIComponent(publicId);
    await this.uploadsService.delete(decoded);
    return { success: true };
  }
}
