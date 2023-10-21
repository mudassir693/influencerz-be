
import { S3 } from "@aws-sdk/client-s3";
import s3Options from "../constants/aws.config";


// const s3Client = new S3Client({});
// // const oneMB = 1024 * (1024/100);
// const oneMB = 1024*120;

// export const getObjectRange = ({ bucket, key, start, end }) => {
//   const command = new GetObjectCommand({
//     Bucket: bucket,
//     Key: key,
//     Range: `bytes=${start}-${end}`,
//   });

//   return s3Client.send(command);
// };

// export const getRangeAndLength = (contentRange) => {
//   const [range, length] = contentRange.split("/");
//   const [start, end] = range.split("-");
//   return {
//     start: parseInt(start),
//     end: parseInt(end),
//     length: parseInt(length),
//   };
// };

// export const isComplete = ({ end, length }) => end === length - 1;
// const downloadInChunks = async ({ bucket, key }) => {
//   const writeStream = createWriteStream(`./images/${key}`
//   ).on("error", (err) => console.error(err));

//   let rangeAndLength = { start: -1, end: -1, length: -1 };
//   let i = 1;
//   while (!isComplete(rangeAndLength)) {
//     const { end } = rangeAndLength;
//     const nextRange = { start: end+1, end: end + oneMB };

//     console.log(`Downloading bytes ${nextRange.start} to ${nextRange.end}`);

//     const { ContentRange, Body } = await getObjectRange({
//       bucket,
//       key,
//       ...nextRange,
//     });

//     let resp = await Body.transformToByteArray()
//     console.log(resp)
//     var str = String.fromCharCode.apply(null, resp);
//     let buffer = Buffer.from(str,'binary')
//     // return buffer
//     writeStream.write(resp);
//     rangeAndLength = getRangeAndLength(ContentRange);
//     i++
//     pipeline
//   }
// };


// export const main = async () => {
//   return await downloadInChunks({
//     bucket: process.env.BUCKET,
//     key: "WhatsApp-Video-test.mp4",
//   });
// };



export default {
  _client: new S3(s3Options),
  _bucket: process.env.BUCKET,

  async getObjectFileSize(key: string) {
    const { ContentLength } = await this._client.headObject({
      Key: key,
      Bucket: this._bucket,
    });
    console.log(ContentLength)
    return ContentLength
  },

  async * initiateObjectStream(key: string, start: number, end: number) {
    const streamRange = `bytes=${start}-${end}`

    const { Body: chunks } = await this._client.getObject({
      Key: key,
      Bucket: this._bucket,
      Range: streamRange
    })
    for await (const chunk of chunks) {
      yield chunk;
    }
  }
}

