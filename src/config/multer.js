import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

/**
 * ============================
 * CLOUDINARY STORAGE
 * ============================
 * - PDFs → raw
 * - Images → image
 * - Works for tests, homework, announcements, profile photo
 */

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";

    // Decide folder logically (optional but clean)
    let folder = "student-portal/others";

    if (req.baseUrl.includes("tests")) folder = "student-portal/tests";
    else if (req.baseUrl.includes("homework")) folder = "student-portal/homework";
    else if (req.baseUrl.includes("announcements")) folder = "student-portal/announcements";
    else if (req.baseUrl.includes("students")) folder = "student-portal/profiles";

    return {
      folder,
      resource_type: isPdf ? "raw" : "image",
      allowed_formats: isPdf ? ["pdf"] : ["jpg", "jpeg", "png"],
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
    };
  },
});

/**
 * ============================
 * FILE FILTERS
 * ============================
 */

const imageFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files allowed"), false);
};

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files allowed"), false);
};

/**
 * ============================
 * EXPORT UPLOADERS
 * ============================
 */

export const uploadProfile = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

export const uploadPDF = multer({
  storage,
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
