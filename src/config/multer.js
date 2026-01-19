import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

/* ================= FILE FILTERS ================= */

const pdfFilter = (req, file, cb) => {
  file.mimetype === "application/pdf"
    ? cb(null, true)
    : cb(new Error("Only PDF files allowed"), false);
};

/* ================= STORAGE ================= */

const createStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `student-portal/${folder}`,
      resource_type: "image", // ✅ KEY CHANGE (NOT raw)
      format: "pdf",
      public_id: () =>
        Date.now() + "-" + Math.round(Math.random() * 1e9),
    },
  });

/* ================= UPLOADER ================= */

export const uploadPDF = multer({
  storage: createStorage("documents"),
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
