module.exports = (sequelize, DataTypes) => {
  const Junction = sequelize.define(
    "Junction",
    {
      id_person: {
        type: DataTypes.INTEGER,
        references: { model: "Persoana", key: "id" },
        onDelete: "CASCADE",
      },
      id_car: {
        type: DataTypes.INTEGER,
        references: { model: "Masina", key: "id" },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "Junction",
      timestamps: false,
    }
  );

  return Junction;
};
