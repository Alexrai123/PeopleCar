module.exports = (app) => {
  "use strict";
  const express = require("express");
  const masinaCtrl = require("../controllers/masinaCtrl")(app.locals.db);
  const router = express.Router();

  router.post("/", masinaCtrl.create);
  router.put("/", masinaCtrl.update);
  router.get("/", masinaCtrl.findAll);
  router.get("/:id", masinaCtrl.find);
  router.delete("/:id", masinaCtrl.destroy);

  return router;
};
