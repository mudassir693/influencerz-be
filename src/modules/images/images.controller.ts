import { Controller, Get, HttpException, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { Multer } from "multer";
import * as fs from 'fs';
import * as path from 'path';

@Controller('/images')
export class ImagesController {
    constructor(private _configService: ConfigService){}

    @Post('/')
    @UseInterceptors(FileInterceptor('image'))
    uploadImage(@UploadedFile(
        new ParseFilePipeBuilder()
            .addMaxSizeValidator({
                maxSize: 1024 * 1024 * 2,
                message:'Image too large (max size: 2mb).'
            })
            // .addFileTypeValidator({
            //     fileType: new RegExp(/image\/(jpe?g|png|gif|mp4)/i),
            //   })

              .build({
                exceptionFactory(error) {
                  if (error.startsWith('Validation failed'))
                    error = 'Image not valid.';
                  throw new HttpException(error, HttpStatus.BAD_REQUEST);
                },
              }),
    ) file: Express.Multer.File): string{
        console.log('file: ', file)

        const filePath = path.join('images', file.originalname);
        console.log('filePath: ',filePath)
        new Promise((resolve, reject)=>{
            fs.writeFile(filePath, file.buffer, (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve('');
                }
              });
        })

        return this._configService.get('PORT')
    }
}