const express = require("express");
const app = express();
var moment = require("moment"); // require
moment().format();

// call model
const siswa = require("../models/index").siswa;
const tunggakan = require("../models/index").tunggakan;

// allow request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// get data by NISN
app.get("/:nisn", async (req, res) => {
  let nisn = {
    nisn: req.params.nisn,
  };

  siswa
    .findOne({ where: nisn, include: [{ all: true, nested: true }] })
    .then((result) => {
      if (result) {
        res.json({
          message: "Data founded",
          data_siswa: result,
          found: true,
        });
      } else {
        res.json({
          message: "Data not found",
          found: false,
        });
      }
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

// auth_verify
const verify = require("./auth_verify");
app.use(verify);

// get data
app.get("/", async (req, res) => {
  siswa
    .findAll({ include: [{ all: true, nested: true }] })
    .then((result) => {
      res.json({
        message: "Data founded",
        siswa: result,
        found: true,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
        found: false,
      });
    });
});

// add data
app.post("/", async (req, res) => {
  const today = new Date();

  // put data
  let data = {
    nisn: req.body.nisn,
    nis: req.body.nis,
    nama: req.body.nama,
    id_kelas: req.body.id_kelas,
    alamat: req.body.alamat,
    no_telp: req.body.no_telp,
    id_spp: req.body.id_spp,
  };

  siswa
    .create(data)
    .then((result) => {
      res.json({
        message: "Data inserted",
        data: result,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });

  for (i = 1; i <=9; i++) {
    // let bulan = new Date();
    // bulan.setDate(today.getDate() + i);

    const bulan_tunggakan = today.getMonth() + i;
    const tahun_tunggakan = today.getFullYear();

    let data_tunggakan = {
      nisn: data.nisn,
      id_spp: data.id_spp,
      bulan: bulan_tunggakan,
      tahun: tahun_tunggakan,
      status: "belum_lunas",
    };

    tunggakan.create(data_tunggakan).then((result) => {
      res
        .json({
          message: "Data tunggakan inserted",
          data: result,
        })
        .catch((error) => {
          res.json({
            message: error.message,
          });
          console.log(message);
        });
    });
  }
});

// update data
app.put("/", async (req, res) => {
  // put data
  let data = {
    nis: req.body.nis,
    nama: req.body.nama,
    id_kelas: req.body.id_kelas,
    alamat: req.body.alamat,
    no_telp: req.body.no_telp,
    id_spp: req.body.id_spp,
  };

  let param = {
    nisn: req.body.nisn,
  };

  siswa
    .update(data, { where: param })
    .then((result) => {
      res.json({
        message: "Data updated",
        data: result,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

// delete data
app.delete("/:nisn", async (req, res) => {
  // put data
  let param = {
    nisn: req.params.nisn,
  };

  siswa
    .destroy({ where: param })
    .then((result) => {
      res.json({
        message: "Data deleted",
        data: result,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

module.exports = app;