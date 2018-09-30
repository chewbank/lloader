"use strict"

const test = require('jtf')
const typea = require('typea')
const lloader = require('..')

test('contain', t => {

   const app = {}

   lloader('app', app).set({
      'other': {
         'level': 6,
         "contain": ['of.js', 'oo']
      },
   })

   lloader.load()

   t.ok(!app.other.index)

   const { data, error } = typea.strict(app, {
      other: {
         oo: Object,
         of: Function
      }
   })

   t.ok(data, error)

})