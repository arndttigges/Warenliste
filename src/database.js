const {Sequelize} = require('sequelize');

class Database {
  /**
   * @param {{
   *   username: string,
   *   password: string,
   *   database: string,
   *   host: string,
   *   port: number,
   *   dialect: string,
   * }} configuration
   */
  constructor(configuration) {
    this.sequelize = new Sequelize(configuration.database, configuration.username, configuration.password, {
      dialect: configuration.dialect,
      host: configuration.host,
      port: configuration.port,
    });
    // this.Contact = require('./models/contact.js')(this.sequelize);
  }

  async saveEntry(data) {
    const contact = await this.Article.upsert(data);
  }

  async fetchEntry(id) {
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