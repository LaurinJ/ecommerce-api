const fs = require("fs");
const { finished } = require("stream");
const path = require("path");
const axios = require("axios");

async function uploadProcess(file) {
  const { createReadStream, filename, mimetype, encoding } = await file.file;
  const stream = createReadStream();
  let path = "images/" + Date.now() + filename;
  const out = fs.createWriteStream(path);
  stream.pipe(out);
  path = path.split("/")[1];
  return { path, filename };
}

async function multipleUpload(files) {
  const promises = await (await Promise.all(files)).map(uploadProcess);
  const images = await Promise.all(promises.map((data) => data));
  return images;
}

async function multiDownload(fileUrls, downloadFolder) {
  // Get the file name
  const imgPaths = fileUrls.map((fileUrl) => {
    return downloadFile(fileUrl, downloadFolder);
  });

  return await Promise.all(imgPaths);
}

const downloadFile = async (fileUrl, downloadFolder) => {
  // Get the file name
  const fileName = path.basename(fileUrl);

  // The path of the downloaded file on our machine
  const localFilePath = path.resolve(downloadFolder, fileName);
  try {
    const response = await axios({
      method: "GET",
      url: fileUrl,
      responseType: "stream",
    });

    const w = response.data.pipe(fs.createWriteStream(localFilePath));
    w.on("finish", () => {
      // console.log("Successfully downloaded file!");
    });

    return fileName;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { uploadProcess, multipleUpload, downloadFile, multiDownload };
