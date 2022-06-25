const express = require("express");
const app = express();

// call tunggakan models
const tunggakan = require("../models/index").tunggakan;

// allow request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// auth_verify
const verify = require("./auth_verify");
app.use(verify);

//get data
app.get("/", async (req, res) => {
  tunggakan
    .findAll({ include: [{ all: true, nested: true }] })
    .then((result) => {
      res.json({
        message: "Data Found",
        tunggakan: result,
        found: true,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
        found: true,
      });
    });
});

// add data
app.post("/", async (req, res) => {
  // data declaration
  let data = {
    nisn: req.body.nisn,
    id_spp: req.body.id_spp,
    bulan: req.body.bulan,
    status: req.body.status,
  };
  tunggakan
    .create(data)
    .then((result) => {
      res.json({
        message: "Data Inserted",
        data: result,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

// update data
app.put("/", async (req, res) => {
  // data declaration
  let data = {
    nisn: req.body.nisn,
    id_spp: req.body.id_spp,
    bulan: req.body.bulan,
    tahun: req.body.tahun,
    status: req.body.status,
  };

  let param = {
    nisn: req.body.nisn,
    bulan: req.body.bulan,
    tahun: req.body.tahun,
  };

  tunggakan
    .update(data, { where: param })
    .then((result) => {
      res.json({
        message: "Data Updated",
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
app.delete("/:id_tunggakan", async (req, res) => {
  // parameter declaration
  let param = {
    id_tunggakan: req.params.id_tunggakan,
  };

  tunggakan
    .destroy({ where: param })
    .then((result) => {
      res.json({
        message: "Data Deleted",
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