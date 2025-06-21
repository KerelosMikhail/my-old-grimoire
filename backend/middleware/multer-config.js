const fs = require("fs");
const multer = require("multer");
const path = require("path");

const imagesDir = "images";
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, imagesDir);
  },
  filename: (req, file, callback) => {
    const name =
      file.fieldname.split(" ").join("_") +
      "-" +
      Date.now() +
      path.extname(file.originalname);
    callback(null, name);
  },
});

const fileFilter = (req, file, callback) => {
  const allowedExt = [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp", ".svg"];
  const allowedMime = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/svg+xml",
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExt.includes(ext) && allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

module.exports = multer({ storage, fileFilter }).single("image");
