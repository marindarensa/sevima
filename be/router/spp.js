const express = require("express");
const app = express();

// call model
const spp = require("../models/index").spp;

// allow request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// auth_verify
const verify = require("./auth_verify");
app.use(verify);

// get data
app.get("/", async (req, res) => {
  spp
    .findAll({ include: [{ all: true, nested: true }] })
    .then((result) => {
      res.json({
        message: "Data founded",
        spp: result,
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
  // put data
  let data = {
    tahun: req.body.tahun,
    nominal: req.body.nominal,
  };

  spp
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
});

// update data
app.put("/", async (req, res) => {
  // put data
  let data = {
    tahun: req.body.tahun,
    nominal: req.body.nominal,
  };

  let param = {
    id_spp: req.body.id_spp,
  };

  spp
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
app.delete("/:id_spp", async (req, res) => {
  // put data
  let param = {
    id_spp: req.params.id_spp,
  };

  spp
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