'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
      table
        .integer('publication_id')
        .unsigned()
        .references('id')
        .inTable('publications')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.string('text').notNullable()  
      table.timestamps()
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentSchema
