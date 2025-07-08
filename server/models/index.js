module.exports = function getModels(sequelize, Sequelize) {
  "use strict";

  const path = require("path");

  const db = {};

  db.Persoana = require(path.join(__dirname, "Persoana.js"))(
    sequelize,
    Sequelize.DataTypes
  );

  db.Masina = require(path.join(__dirname, "Masina.js"))(
    sequelize,
    Sequelize.DataTypes
  );

  db.Junction = require(path.join(__dirname, "Junction.js"))(
    sequelize,
    Sequelize.DataTypes
  );

  db.Persoana.belongsToMany(db.Masina, {
    through: "Junction",
    foreignKey: "id_person",
    otherKey: "id_car",
  });

  db.Masina.belongsToMany(db.Persoana, {
    through: "Junction",
    foreignKey: "id_car",
    otherKey: "id_person",
  });

  console.log("Modelele și relațiile au fost încărcate.");

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
};
