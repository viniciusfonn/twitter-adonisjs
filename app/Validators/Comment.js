'use strict'

class CommentStore {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      text: 'required'
    }
  }
}

module.exports = CommentStore
