// multer.js
import multer from "multer";
import cloudinary from "./cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

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

/* ================= STORAGE ================= */

const createStorage = (folder, resourceType) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `student-portal/${folder}`,
      resource_type: resourceType,
      public_id: () =>
        Date.now() + "-" + Math.round(Math.random() * 1e9),
    },
  });

/* ================= UPLOADERS ================= */

export const uploadProfile = multer({
  storage: createStorage("profiles", "image"),
  fileFilter: imageFilter,
});

export const uploadPDF = multer({
  storage: createStorage("documents", "raw"),
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});