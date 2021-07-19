const fs = require("fs");

async function uploadProcess(file) {
  const { createReadStream, filename, mimetype, encoding } = await file;
  const stream = createReadStream();
  let path = "images/" + Date.now() + filename;
  const out = fs.createWriteStream(path);
  stream.pipe(out);
  path = path.split("/")[1];
  return { path, filename };
}
