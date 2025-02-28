const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// uploads klasörünü kontrol et ve yoksa oluştur
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Klasör yoksa oluştur
}

// Multer yapılandırması
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Yüklenen dosyalar "uploads" klasörüne kaydedilecek
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Varsayılan olarak orijinal adını kullan
  },
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

// Statik dosyaları "uploads" klasöründen sunmak için
app.use("/uploads", express.static(uploadDir));

// Ana sayfa (Formu göster)
app.get("/", (req, res) => {
  res.render("index", { files: fs.readdirSync(uploadDir) });
});

// Dosya yükleme işlemi
app.post("/share", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Dosya yüklenemedi!");
  }
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
