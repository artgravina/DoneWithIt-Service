const jsonServer = {
  baseUrl: process.env.JSON_IMAGE_PUBLIC_URL,
  port: process.env.PORT,
  directory: process.env.JSON_IMAGE_PATH,
  fileUri: process.env.JSON_FILE_URI,
};

const gcloudServer = {
  baseUrl: process.env.GCLOUD_IMAGE_PUBLIC_URL,
  directory: process.env.GCLOUD_IMAGE_PATH,
  bucketName: process.env.GCLOUD_STORAGE_BUCKET_NAME,
};

const getCurrentSettings = () => {
  if (process.env.IS_JSON_SERVER) return jsonServer;
  if (process.env.IS_GCLOUD_SERVER) return gcloudServer;
  return {};
};

module.exports = getCurrentSettings();
