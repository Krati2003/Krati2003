const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path");
const cors = require('cors');
const fileUpload = require("express-fileupload");

app.use(fileUpload())
app.use(express.json());
app.use(cors());
dotenv.config(); 
app.use("/images", express.static(path.join(__dirname, "/images")));
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name); 
//   },
// });

// const upload = multer({ storage: storage });
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   res.status(200).json("File has been uploaded");
// });

app.post('/api/upload', (req, res) => {
  let uploadFile = req.files.file
  const fileName = uploadFile.name
  uploadFile.mv(
    `${__dirname}/images/${fileName}`,
    function (err) {
      if (err) {
        return res.status(500).send(err)
      }

      res.status(200).json("File uploaded");
    },
  )
})

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen("5000", () => {
  console.log("Backend is running.");
});
