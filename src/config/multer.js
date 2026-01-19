const createStorage = (folder, resourceType = "auto") =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `student-portal/${folder}`,
      resource_type: resourceType,
      public_id: () =>
        Date.now() + "-" + Math.round(Math.random() * 1e9),
    },
  });

export const uploadProfile = multer({
  storage: createStorage("profiles", "image"),
  fileFilter: imageFilter,
});

export const uploadPDF = multer({
  storage: createStorage("documents", "raw"), // ✅ FIX
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});