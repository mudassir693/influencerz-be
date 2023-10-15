import { Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from 'fs';
import { PrismaClient } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";

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
}