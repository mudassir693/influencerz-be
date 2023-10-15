import { Module } from "@nestjs/common";
import { ImagesController } from "./images.controller";
import { ImageService } from "./images.service";
import { DatabaseModule } from "src/database/database.module";

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
    imports: [DatabaseModule],
    controllers:[ImagesController],
    providers:[ImageService]
})
export class ImagesModule {}