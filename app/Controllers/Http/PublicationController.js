'use strict'

const Publication = use('App/Models/Publication')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with publications
 */
class PublicationController {
  /**
   * Show a list of all publications.
   * GET publications
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ }) {
    const publications = await Publication.query()
      .with('user')
      .with('comments')
      .orderBy('created_at', 'desc')
      .fetch()

    return publications
    
  }



  /**
   * Create/save a new publication.
   * POST publications
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, auth }) {
    const data = await request.only(['title', 'text'])

    const publication = await Publication.create({ ...data, user_id: auth.user.id })

    return publication
  }

  /**
   * Display a single publication.
   * GET publications/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params }) {
    const publication = await Publication.findOrFail(params.id)

    await publication.load('user')
    await publication.load('comments')

    return publication
  }



  /**
   * Update publication details.
   * PUT or PATCH publications/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, response, request, auth }) {
    const publication = await Publication.findOrFail(params.id)

    if (auth.user.id !== publication.user_id) {
      return response
        .status(401)
        .send({ error: { message: 'Acesso não autorizado' } })
    }

    const data = await request.only(['title', 'text'])

    publication.merge(data)
    await publication.save()

    return publication


  }

  /**
   * Delete a publication with id.
   * DELETE publications/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, auth, response }) {
    const publication = await Publication.findOrFail(params.id)

    if (auth.user.id !== publication.user_id) {
      return response
        .status(401)
        .send({ error: { message: 'Acesso não autorizado' } })
    }

    await publication.delete()
  }
}

module.exports = PublicationController

