const AWS = require('aws-sdk');

// Name of the bucket you want to traverse
const BUCKET = process.env.BUCKET || '';

// Extensions of the files you want to filter out.
// Leave empty to get all the files.
const ALLOWED_EXTENSIONS = (process.env.EXTENSIONS && process.env.EXTENSIONS.split(',')) || [];

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
});

/**
 * @param params
 * @returns {Promise<PromiseResult<S3.ListObjectsV2Output, AWSError>>}
 */
const listObjects = (...params) => s3.listObjectsV2(...params).promise();

/**
 * @param value
 * @returns {Promise<any>}
 */
const writeOut = value => new Promise(((resolve, reject) => {
  process.stdout.write(value, (err) => {
    if (err) {
      return reject(err);
    }

    return resolve();
  });
}));

/**
 * @param item
 * @returns {boolean}
 */
const filterByExtensions = (item) => {
  if (ALLOWED_EXTENSIONS.length === 0) {
    return true;
  }

  return ALLOWED_EXTENSIONS.includes(item.Key.split('.').pop());
};

async function runner({
  NextContinuationToken,
} = {}) {
  const params = {
    Bucket: BUCKET,
    ContinuationToken: NextContinuationToken,
  };

  const result = await listObjects(params);
  await Promise.all(result.Contents
    .filter(filterByExtensions)
    .map(item => item.Key)
    .map(fileName => writeOut(`${fileName}\n`)));

  if (result.NextContinuationToken) {
    return runner(result);
  }

  return undefined;
}


runner()
  .catch((error) => {
    process.stderr.write(error);
  });
