const fs = require("fs");
const { finished } = require("stream");

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

module.exports = { uploadProcess, multipleUpload };
