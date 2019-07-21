'use strict'
const Comment = use('App/Models/Comment')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with comments
 */
class CommentController {
  /**
   * Show a list of all comments.
   * GET comments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ params }) {
    const comments = await Comment.query()
      .where('publication_id', params.publications_id)
      .with('user')
      .fetch()

    return comments
  }



  /**
   * Create/save a new comment.
   * POST comments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ params, request, auth }) {
    const data = request.only([
      'user_id',
      'text'
    ])

    const comment = Comment.create({ ...data, publication_id: params.publications_id, user_id: auth.user.id })

    return comment
  }

  /**
   * Display a single comment.
   * GET comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params }) {
    const comment = await Comment.findOrFail(params.id)


    return comment
  }



  /**
   * Update comment details.
   * PUT or PATCH comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    const data = request.only([
      'text'
    ])

    const comment = await Comment.findOrFail(params.id)

    if (auth.user.id !== comment.user_id) {
      return response
        .status(401)
        .send({ error: { message: 'Acesso não autorizado' } })
    }

    comment.merge(data)

    await comment.save()

    return comment
  }

  /**
   * Delete a comment with id.
   * DELETE comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, auth, response }) {
    const comment = await Comment.findOrFail(params.id)

    await comment.load('publication')

    const publication = comment.getRelated('publication')

    if (auth.user.id === comment.user_id || auth.user.id === publication.user_id ) {
      await comment.delete()
    }
    else {
      return response
        .status(401)
        .send({ error: { message: 'Acesso não autorizado' } })
    }

  }
}

module.exports = CommentController
