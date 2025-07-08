module.exports = (db) => {
  return {
    create: (req, res) => {
      const { marca, model, an_fabricatie, capacitate_cilindrica } = req.body;
      const taxa_impozit =
        capacitate_cilindrica < 1500
          ? 50
          : capacitate_cilindrica <= 2000
          ? 100
          : 200;

      db.sequelize
        .query(
          `INSERT INTO "Masina" (marca, model, an_fabricatie, capacitate_cilindrica, taxa_impozit)
         VALUES (:marca, :model, :an_fabricatie, :capacitate_cilindrica, :taxa_impozit)`,
          {
            replacements: {
              marca,
              model,
              an_fabricatie,
              capacitate_cilindrica,
              taxa_impozit,
            },
            type: db.Sequelize.QueryTypes.INSERT,
          }
        )
        .then(() => res.send({ success: true }))
        .catch(() => res.status(401));
    },

    update: (req, res) => {
      const { id, marca, model, an_fabricatie, capacitate_cilindrica } =
        req.body;
      const taxa_impozit =
        capacitate_cilindrica < 1500
          ? 50
          : capacitate_cilindrica <= 2000
          ? 100
          : 200;

      db.sequelize
        .query(
          `UPDATE "Masina"
         SET marca = :marca, model = :model, an_fabricatie = :an_fabricatie,
             capacitate_cilindrica = :capacitate_cilindrica, taxa_impozit = :taxa_impozit
         WHERE id = :id`,
          {
            replacements: {
              id,
              marca,
              model,
              an_fabricatie,
              capacitate_cilindrica,
              taxa_impozit,
            },
            type: db.Sequelize.QueryTypes.UPDATE,
          }
        )
        .then(() => res.send({ success: true }))
        .catch(() => res.status(401));
    },

    findAll: (req, res) => {
      db.sequelize
        .query(
          `SELECT id, marca, model, an_fabricatie, capacitate_cilindrica, taxa_impozit
         FROM "Masina"
         ORDER BY id`,
          { type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((resp) => res.send(resp))
        .catch(() => res.status(401));
    },

    find: (req, res) => {
      db.sequelize
        .query(
          `SELECT id, marca, model, an_fabricatie, capacitate_cilindrica, taxa_impozit
         FROM "Masina"
         WHERE id = :id`,
          {
            replacements: { id: req.params.id },
            type: db.Sequelize.QueryTypes.SELECT,
          }
        )
        .then((resp) => {
          if (!resp.length)
            return res.status(404).send({ error: "Mașina nu există" });
          res.send(resp[0]);
        })
        .catch(() => res.status(401));
    },

    destroy: (req, res) => {
      db.sequelize
        .query(`DELETE FROM "Masina" WHERE id = ${req.params.id}`, {
          type: db.Sequelize.QueryTypes.DELETE,
        })
        .then(() => res.send({ success: true }))
        .catch(() => res.status(401));
    },
  };
};
