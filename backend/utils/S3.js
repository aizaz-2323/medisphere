// Step 5 creates a small helper file that does one job: take a file and put it in your S3 bucket. Instead of repeating the upload code in every route, you write it once and import it wherever you need it.
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = new S3Client({ region: process.env.AWS_REGION });
async function uploadToS3(buffer, key, mimetype) {
await s3.send(new PutObjectCommand({
Bucket: process.env.AWS_BUCKET_NAME,
Key: key,
Body: buffer,
ContentType: mimetype,
}));
return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/$
{key}`;
}
module.exports = { uploadToS3 };