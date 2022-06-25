const express = require("express");
const app = express();

// call tunggakan models
const tunggakan = require("../models/index").tunggakan;

// allow request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//get data
app.get("/:nisn/:status", async (req, res) => {
  let param = {
    nisn: req.params.nisn,
    status: req.params.status,
  };

  tunggakan
    .findAll({ where: param, include: [{ all: true, nested: true }] })
    .then((result) => {
      if (result) {
        res.json({
          message: "Data founded",
          tunggakan: result,
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
        found: false,
      });
    });
});

module.exports = app;