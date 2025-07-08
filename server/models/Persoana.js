module.exports = (sequelize, DataTypes) => {
  const Persoana = sequelize.define(
    "Persoana",
    {
      nume: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      prenume: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      cnp: {
        type: DataTypes.STRING(13),
        allowNull: false,
        unique: true,
      },
      varsta: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Persoana.associate = (models) => {
    Persoana.belongsToMany(models.Masina, {
      through: "Junction",
      foreignKey: "id_person",
      otherKey: "id_car",
      onDelete: "CASCADE",
    });
  };

  return Persoana;
};
