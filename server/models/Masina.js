module.exports = (sequelize, DataTypes) => {
  const Masina = sequelize.define(
    "Masina",
    {
      marca: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      model: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      an_fabricatie: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      capacitate_cilindrica: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      taxa_impozit: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  Masina.associate = (models) => {
    Masina.belongsToMany(models.Persoana, {
      through: "Junction",
      foreignKey: "id_car",
      otherKey: "id_person",
      onDelete: "CASCADE",
    });
  };

  return Masina;
};
