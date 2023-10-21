import { Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from 'fs';
import { PrismaClient } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import main  from "src/config/helpers/aws.helper";
import { pipeline } from "stream/promises";
// import  S3Client  from "../../config/helpers/aws.helper";

@Injectable()
export class ImageService {
    constructor(private _dbService: DatabaseService){}

    uploadFile(file: Express.Multer.File): {Success: boolean}{
        // this._dbService.image.findMany()
        const filePath = path.join('images', file.originalname);
        new Promise((resolve, reject)=>{
            fs.writeFile(filePath, file.buffer, (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve('');
                }
              });
        })

        return {Success: true}
    }

    async createReadStream(response, key){
      
      const controller = new AbortController()
      try {

        let length = await main.getObjectFileSize(key)
        response.setHeader("Accept-Ranges", "bytes");
        response.setHeader("Content-Range", `bytes ${0}-${length}`);

        await pipeline(main.initiateObjectStream(key, 0, length),response,{signal: controller.signal})
      } catch (error) {
        console.log(error)
      }
    }
}