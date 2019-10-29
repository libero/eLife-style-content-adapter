const fs = require('fs');
const Zip = require('adm-zip');
const uuidv4 = require('uuid/v4');
const getS3Client = require('../aws/get-s3-client');


async function extractArchivedFilesToBucket() {

  function deleteFile(fileName) {
    fs.unlinkSync(fileName);
    console.log('successfully deleted ' + fileName);
  }

  let tempFileName = '/tmp/' + uuidv4();
  const fileStream = fs.createWriteStream(tempFileName);

  let s3 = getS3Client();

  let s3Params = {
    Bucket: process.env.SOURCE_BUCKET,
    Key: process.env.ARCHIVE_FILE_NAME
  };

  console.log('Getting the following from S3: ', s3Params);
  await new Promise((resolve, reject) => {
    s3.getObject(s3Params).createReadStream()
      .on('end', () => {
        return resolve();
    }).on('error', (error) => {
        deleteFile(tempFileName);
        return reject(error);
    }).pipe(fileStream)});

  let archive = new Zip(tempFileName);
  s3Params = {Bucket: process.env.DESTINATION_BUCKET};

  for (let entry of archive.getEntries()) {
    if (entry.isDirectory) {
      continue;
    }

    // TODO: stream data to s3 asynchronously
    s3Params.Key = process.env.ARCHIVE_FILE_NAME.replace(new RegExp('\\.\\w+$'), '') + '/' + entry.entryName;
    s3Params.Body = entry.getData();

    let response = await s3.upload(s3Params, (error) => {
      if (error) {
        deleteFile(tempFileName);
        throw error;
      }
    }).promise();
    console.log(response.Location);
  }

  // remove temp file if all succeeded
  deleteFile(tempFileName);

}

module.exports = extractArchivedFilesToBucket;
