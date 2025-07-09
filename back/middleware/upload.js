// middleware/upload.js
import multer from "multer";

const storage = multer.memoryStorage(); // untuk simpan file di buffer (bukan folder)
const upload = multer({ storage });

export default upload;
