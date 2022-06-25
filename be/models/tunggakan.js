"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tunggakan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.siswa, {
        foreignKey: "nisn",
        as: "siswa",
      });

      this.belongsTo(models.spp, {
        foreignKey: "id_spp",
        as: "spp",
      });
    }
  }
  tunggakan.init(
    {
      id_tunggakan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      nisn: DataTypes.INTEGER,
      id_spp: DataTypes.INTEGER,
      bulan: DataTypes.STRING,
      tahun: DataTypes.STRING,
      status: DataTypes.ENUM("lunas", "belum_lunas"),
    },
    {
      sequelize,
      modelName: "tunggakan",
      tableName: "tunggakan",
    }
  );
  return tunggakan;
};