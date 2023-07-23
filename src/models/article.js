const { Model, DataTypes } = require('sequelize');

class Article extends Model {
  static associate(models) {
  }
}

module.exports = (sequelize) => {
    Article.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      articleNr: DataTypes.STRING,
      description: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      unit: DataTypes.STRING,
      list_price: DataTypes.FLOAT,
      netto_price: DataTypes.FLOAT,
      transaction_number: DataTypes.STRING,
      date: DataTypes.DATE,
    }, {
      sequelize,
      modelName: 'Article',
      tableName: 'article'
    });
  
    return Article;
  };
  