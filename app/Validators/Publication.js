'use strict'

class Publication {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      title: 'required',
      text: 'required'
    }
  }
}

module.exports = Publication
