const multer = require("multer");
const fs = require("fs");

module.exports = {
  uploader: (directory, filePrefix) => {
    let defaultDirectory = "./src/public";

    const storageUploader = multer.diskStorage({
      destination: (req, file, cb) => {
        const pathDirectory = directory ? defaultDirectory + directory : defaultDirectory;

        if (fs.existsSync(pathDirectory)) {
          console.log(`Directory ${pathDirectory} exist`);
          cb(null, pathDirectory);
        } else {
          fs.mkdir(pathDirectory, { recursive: true }, (err) => {
            if (err) {
              console.log(`Error making directory`, err);
            }
            cb(err, pathDirectory);
          });
        }
      },
      filename: (req, file, cb) => {
        let ext = file.originalname.split(".");
        console.log("ext:", ext);
        let newName = filePrefix + Date.now() + "." + ext[ext.length - 1];
        console.log("New Filename", newName);
        cb(null, newName);
      },
    });
    return multer({
      storage: storageUploader,
      fileFilter: (req, file, cb) => {
        const extFilter = /\.(jpg|jpeg|png|webp|PNG|JPG|JPEG|WEBP)/;
        let check = file.originalname.toLocaleLowerCase().match(extFilter);
        if (check) {
          cb(null, true);
        } else {
          cb(new Error(`Your file extension is denied`, false));
        }
      },
    });
  },
};
