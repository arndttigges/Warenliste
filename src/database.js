const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

class Database {
  constructor() {
    const dbPath = path.join(__dirname, 'article.sqlite');
    
    this.sequelize =  new Sequelize({
      dialect: 'sqlite',
      storage: dbPath,
    });
    
    this.Article = require('./models/article.js')(this.sequelize);
  }

  async sync() {
    try{
      this.Article.sync();
    } catch(error) {
      console.log(error)
    }
  }

  async saveArticle(data) {
    const contact = await this.Article.upsert(data);
  }

  async fetchArticle(id) {
    return this.Article.findByPk(id);
  }

  async fetchArticles() {
    return this.Article.findAll(
        {
            order: [['createdAt', 'ASC']]
        }
    );
  }
}

module.exports = Database;