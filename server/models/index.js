import { Sequelize } from 'sequelize'
import { Game } from './game.model.js'

const sequelize = new Sequelize(
  `sqlite:${new URL('../db.sqlite3', import.meta.url)}`,
)

Game.declareModel(sequelize)

export { sequelize, Game }
