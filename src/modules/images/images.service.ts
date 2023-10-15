import { Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from 'fs';

@Injectable()
export class ImageService {
    constructor(){}

    uploadFile(file: Express.Multer.File): {Success: boolean}{
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