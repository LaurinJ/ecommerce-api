// const fs = require("fs");
// const { finished } = require("stream");
// const path = require("path");
// const axios = require("axios");

import fs from "fs";
import { finished } from "stream";
import path from "path";
import axios from "axios";

export async function uploadProcess(file, path) {
  const { createReadStream, filename, mimetype, encoding } = await file.file;
  const stream = createReadStream();
  const imageName = Date.now() + filename;
  let _path;
  if (path) {
    _path = "images/" + path + imageName;
  } else {
    _path = "images/" + imageName;
  }
  const out = fs.createWriteStream(_path);
  stream.pipe(out);
  _path = path + imageName;
  return { _path, filename };
}

export async function multipleUpload(files) {
  const promises = await (await Promise.all(files)).map(uploadProcess);
  const images = await Promise.all(promises.map((data) => data));
  return images;
}

export async function multiDownload(fileUrls, downloadFolder) {
  // Get the file name
  const imgPaths = fileUrls.map((fileUrl) => {
    return downloadFile(fileUrl, downloadFolder);
  });

  return await Promise.all(imgPaths);
}

export const downloadFile = async (fileUrl, downloadFolder) => {
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
