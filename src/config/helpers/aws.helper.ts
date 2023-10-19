// import { S3Client, ListBucketsCommand, S3, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

// import s3Options from "../constants/aws.config";

// export default {
//     _client: new S3(s3Options),
//     _bucket: process.env.BUCKET,

    
//     async getObjectFileSize(Key="WhatsApp-Video-test.mp4") {
//       let client = new S3Client({})
//       console.log('bucket: ',this._bucket)
//       try {
//         // const { ContentLength } = await this._client.headObject({
//         //   Key,
//         //   Bucket: this._bucket,
//         // });

//         const command = new ListObjectsV2Command({
//           // Bucket: this._bucket,
//           // Key: "WhatsApp-Video-test.mp4",
//           Bucket: this._bucket,
//           // MaxKeys
//         });

//         // console.log(command)
//         const { Contents, IsTruncated, NextContinuationToken } = await client.send(command);
//         console.log({Contents, IsTruncated, NextContinuationToken})
//         // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
//         // const str = await response.Body.transformToString();
//         // console.log(str);
        
//         return command
//       } catch (error) {
//         console.log(error)
//       }
//     },

//     async getListBuckets(Key="WhatsApp-Video-test.mp4") {
//       console.log('bucket: ',this._bucket)
//       try {
//         const { ContentLength } = await this._client.headObject({
//           Key,
//           Bucket: this._bucket,
//         });
        
//         return ContentLength
//       } catch (error) {
//         console.log(error)
//       }
//     },
  
//     async * initiateObjectStream(Key, start, end) {
//       const streamRange = `bytes=${start}-${end}`
  
//       const { Body: chunks } = await this._client.getObject({
//         Key,
//         Bucket: this._bucket,
//         Range: streamRange
//       })
  
//       for await (const chunk of chunks) {
//         console.log(chunk)
//         yield chunk;
//       }
//     }
//   }

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";

const s3Client = new S3Client({});
const oneMB = 1024 * (1024/1000);
// const oneMB = 10;

export const getObjectRange = ({ bucket, key, start, end }) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    Range: `bytes=${start}-${end}`,
  });

  return s3Client.send(command);
};

export const getRangeAndLength = (contentRange) => {
  const [range, length] = contentRange.split("/");
  const [start, end] = range.split("-");
  return {
    start: parseInt(start),
    end: parseInt(end),
    length: parseInt(length),
  };
};

export const isComplete = ({ end, length }) => end === length - 1;

// When downloading a large file, you might want to break it down into
// smaller pieces. Amazon S3 accepts a Range header to specify the start
// and end of the byte range to be downloaded.
const downloadInChunks = async ({ bucket, key }) => {
  // const writeStream = createWriteStream(
  //   fileURLToPath(new URL(`./${key}`, import.meta.url))
  // ).on("error", (err) => console.error(err));

  let rangeAndLength = { start: -1, end: -1, length: -1 };
  let i = 1;
  // while (!isComplete(rangeAndLength) && i<=2) {
    const { end } = rangeAndLength;
    const nextRange = { start: end>0?end-1:end+1, end: end + oneMB };

    console.log(`Downloading bytes ${nextRange.start} to ${nextRange.end}`);

    const { ContentRange, Body } = await getObjectRange({
      bucket,
      key,
      ...nextRange,
    });

    let resp = await Body.transformToByteArray()
    console.log(resp)
    return resp
    // writeStream.write(await Body.transformToByteArray());
    rangeAndLength = getRangeAndLength(ContentRange);
    i++
  // }
};

export const main = async () => {
  return await downloadInChunks({
    bucket: process.env.BUCKET,
    key: "WhatsApp-Video-test.mp4",
  });
};

