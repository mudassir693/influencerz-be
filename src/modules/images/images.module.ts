import { Module } from "@nestjs/common";
import {MulterModule} from '@nestjs/platform-express'
import { ImagesController } from "./images.controller";

import { diskStorage } from "multer";
import { extname } from "path";

@Module({
    // imports:[MulterModule.register({
    //     storage: diskStorage({
    //       destination: './uploads', // specify the upload folder
    //       filename: (req, file, callback) => {
    //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    //         const extension = extname(file.originalname);
    
    //         console.log(`${uniqueSuffix}${extension}`)
    //         callback(null, `${uniqueSuffix}${extension}`);
    //       },
    //     })
    //   })],
    controllers:[ImagesController]
})
export class ImagesModule {}