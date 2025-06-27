const multer = require("multer");
const path = require("path");

const fileFilter = (req, file, cb) => {
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

module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("image");
