'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Comment extends Model {
    publication () {
        return this.belongsTo('App/Models/Publication')
    }

    user () {
        return this.belongsTo('App/Models/User')
    }
}

module.exports = Comment
