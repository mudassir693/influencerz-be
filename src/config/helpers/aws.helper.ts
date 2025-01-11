import { S3 } from "@aws-sdk/client-s3";
import s3Options from "../constants/aws.config";

// S3 client instance
const s3Client = new S3(s3Options);

// Constants
const ONE_MB = 1024 * 120; // Approximate size in bytes

const getObjectRange = async ({ bucket, key, start, end }) => {
  const range = `bytes=${start}-${end}`;
  const command = await s3Client.getObject({
    Bucket: bucket,
    Key: key,
    Range: range,
  });

  return command;
};

const parseContentRange = (contentRange) => {
  const [range, length] = contentRange.split("/");
  const [start, end] = range.split("-");
  return {
    start: parseInt(start, 10),
    end: parseInt(end, 10),
    length: parseInt(length, 10),
  };
};

// const isDownloadComplete = ({ end, length }) => end === length - 1;
const IsDownloadComplete = ({ end, length }) => end === length - 1;

const downloadInChunks = async ({ bucket, key }) => {
  const writeStream = createWriteStream(`./images/${key}`).on("error", (err) => console.error(err));

  let rangeAndLength = { start: -1, end: -1, length: -1 };
  let i = 1;
  while (!isDownloadComplete(rangeAndLength)) {
    const { end } = rangeAndLength;
    const nextRange = { start: end + 1, end: end + ONE_MB };

    console.log(`Downloading bytes ${nextRange.start} to ${nextRange.end}`);

    const { ContentRange, Body } = await getObjectRange({
      bucket,
      key,
      ...nextRange,
    });

    const byteArray = await Body.transformToByteArray();
    console.log(byteArray);
    
    const buffer = Buffer.from(byteArray, "binary");

    writeStream.write(buffer);
    rangeAndLength = parseContentRange(ContentRange);
    i++;
  }
};

export default {
  _client: new S3(s3Options),
  _bucket: process.env.BUCKET,

  async getObjectFileSize(key) {
    const { ContentLength } = await this._client.headObject({
      Key: key,
      Bucket: this._bucket,
    });
    console.log(ContentLength);
    return ContentLength;
  },

  async *initiateObjectStream(key, start, end) {
    const range = `bytes=${start}-${end}`;
    const { Body: chunks } = await this._client.getObject({
      Key: key,
      Bucket: this._bucket,
      Range: range,
    });

    // Yield each chunk of the object
    for await (const chunk of chunks) {
      yield chunk;
    }
  },

  async initiateDownload({ bucket, key }) {
    const fileSize = await this.getObjectFileSize(key);
    let start = 0;
    let end = ONE_MB;

    while (start < fileSize) {
      console.log(`Initiating download: bytes ${start}-${end}`);

      // Download next chunk
      const stream = this.initiateObjectStream(key, start, end);

      // This can be used to consume the stream and save to a file
      for await (const chunk of stream) {
        // Process chunk (you can save to a file or handle the chunk here)
        console.log(`Downloaded chunk from ${start} to ${end}`);
      }

      start = end + 1;
      end = Math.min(end + ONE_MB, fileSize); // Ensure we don't exceed the file size
    }
  }
}
