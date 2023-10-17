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

    createReadStream(){
      const options = {
        start: 11 ,  // Start position in bytes
        end:20    // End position in bytes
      };
      const filePath = path.join('images', "WhatsApp-Video-test.mp4");
      const readStream = fs.createReadStream(filePath, options);
      readStream.on('data', (chunk) => {
        // Process the data chunk here
        // You can do whatever you want with the data, e.g., write it to another file or process it in some way
    
        // Example: Output the size of each data chunk
        console.log(chunk)
        console.log(`Received chunk of size ${chunk.length} bytes`);
      });

      // Listen for 'end' event
      readStream.on('end', () => {
        console.log('Chunk processing complete');
      });

      // Listen for 'error' event
      readStream.on('error', (err) => {
        console.error(`Error reading the chunk: ${err}`);
      });
      return "Hello for now"
    }
}