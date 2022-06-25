const express = require("express");
const app = express();

var cors = require("cors");
app.use(cors());

app.use(express.static(__dirname));

// router
const kelas = require("./router/kelas");
const spp = require("./router/spp");
const siswa = require("./router/siswa");
const petugas = require("./router/petugas");
const pembayaran = require("./router/pembayaran");
const auth = require("./router/auth");
const tunggakan = require("./router/tunggakan");
const tunggakanSiswa = require("./router/tunggakanSiswa")

app.use("/auth", auth);
app.use("/kelas", kelas);
app.use("/spp", spp);
app.use("/siswa", siswa);
app.use("/petugas", petugas);
app.use("/pembayaran", pembayaran);
app.use("/tunggakan", tunggakan);
app.use("/tunggakanSiswa", tunggakanSiswa)

app.listen(8000, () => {
  console.log("Server run on 8000");
});