require('dotenv').config()
const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)

const url = process.env.DATABASE_URL
const db = {}

const sequelize = new Sequelize(url, {
  dialect: 'postgres'
})

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
