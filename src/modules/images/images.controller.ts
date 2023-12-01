import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseFilePipeBuilder, Post, Response, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { Multer } from "multer";
import * as fs from 'fs';
import * as path from 'path';
import { ImageService } from "./images.service";

@Controller('/images')
export class ImagesController {
    constructor(private _configService: ConfigService, private _imageService: ImageService){}

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
    ) file: Express.Multer.File): {Success: boolean}{
        return this._imageService.uploadFile(file)
    }

    @Get('/:key')
    readStream(@Param() params:any, @Response() response: Express.Response): any{
      return this._imageService.createReadStream(response, params.key)
    }
    
    @Post('/test')
    CheckLambdaTrigger(@Body() data: any){
      console.log('data: ',data)
      return {
        message: "connection access successfully."
      }
    }
}