module.exports = (db) => {
  return {
    create: async (req, res) => {
      try {
        const { masini, ...persoanaData } = req.body;

        const persoana = await db.Persoana.create(persoanaData);

        if (masini && masini.length) {
          const values = masini.map((masinaId) => ({
            id_person: persoana.id,
            id_car: masinaId,
          }));
          await db.Junction.bulkCreate(values);
        }

        res.send({ success: true });
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Eroare la creare persoană" });
      }
    },

    update: async (req, res) => {
      try {
        const { masini, id, ...persoanaData } = req.body;

        await db.Persoana.update(persoanaData, { where: { id } });

        await db.Junction.destroy({ where: { id_person: id } });

        if (masini && masini.length) {
          const values = masini.map((masinaId) => ({
            id_person: id,
            id_car: masinaId,
          }));
          await db.Junction.bulkCreate(values);
        }

        res.send({ success: true });
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Eroare la actualizare persoană" });
      }
    },

    findAll: (req, res) => {
      db.sequelize
        .query(
          `
        SELECT p.id, p.nume, p.prenume, p.cnp, p.varsta,
               json_agg(json_build_object(
                   'id', m.id,
                   'marca', m.marca,
                   'model', m.model
               )) AS masini
        FROM "Persoana" p
        LEFT JOIN "Junction" j ON p.id = j.id_person
        LEFT JOIN "Masina" m ON m.id = j.id_car
        GROUP BY p.id
        ORDER BY p.id;
        `,
          { type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((resp) => res.send(resp))
        .catch((err) => {
          console.error(err);
          res.status(500).send({ error: "Eroare la listare persoane" });
        });
    },

    find: (req, res) => {
      db.sequelize
        .query(
          `
        SELECT p.id, p.nume, p.prenume, p.cnp, p.varsta,
               json_agg(json_build_object(
                   'id', m.id,
                   'marca', m.marca,
                   'model', m.model
               )) AS masini
        FROM "Persoana" p
        LEFT JOIN "Junction" j ON p.id = j.id_person
        LEFT JOIN "Masina" m ON m.id = j.id_car
        WHERE p.id = :id
        GROUP BY p.id;
        `,
          {
            replacements: { id: req.params.id },
            type: db.Sequelize.QueryTypes.SELECT,
          }
        )
        .then((resp) => {
          if (!resp.length)
            return res.status(404).send({ error: "Persoana nu există" });
          res.send(resp[0]);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send({ error: "Eroare la găsire persoană" });
        });
    },

    destroy: async (req, res) => {
      try {
        await db.Junction.destroy({ where: { id_person: req.params.id } });
        await db.Persoana.destroy({ where: { id: req.params.id } });

        res.send({ success: true });
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Eroare la ștergere persoană" });
      }
    },

    deleteMasinaFromPersoana: async (req, res) => {
      try {
        const { id_person, id_car } = req.body;
        await db.Junction.destroy({ where: { id_person, id_car } });
        res.send({ success: true });
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .send({ error: "Eroare la ștergerea mașinii din persoană" });
      }
    },
  };
};
