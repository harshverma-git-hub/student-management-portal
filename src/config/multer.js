import multer from "multer";
import path from "path";
import fs from "fs";

/* ================= ENSURE FOLDERS ================= */

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const baseUploadDir = "uploads";

ensureDir(baseUploadDir);
ensureDir("uploads/tests");
ensureDir("uploads/homework");
ensureDir("uploads/announcements");
ensureDir("uploads/profiles");

/* ================= STORAGE ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Decide folder based on route
    if (req.baseUrl.includes("tests")) {
      cb(null, "uploads/tests");
    } else if (req.baseUrl.includes("homework")) {
      cb(null, "uploads/homework");
    } else if (req.baseUrl.includes("announcements")) {
      cb(null, "uploads/announcements");
    } else {
      cb(null, "uploads/profiles");
    }
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

/* ================= FILE FILTERS ================= */

const imageFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "image/jpg"];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only image files allowed"), false);
};

const pdfFilter = (req, file, cb) => {
  file.mimetype === "application/pdf"
    ? cb(null, true)
    : cb(new Error("Only PDF files allowed"), false);
};

/* ================= EXPORT UPLOADERS ================= */

export const uploadProfile = multer({
  storage,
  fileFilter: imageFilter,
});

export const uploadPDF = multer({
  storage,
  fileFilter: pdfFilter,
});

export default multer({ storage });
