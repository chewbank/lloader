"use strict"

const test = require('jtf')
const typea = require('typea')
const lloader = require('..')

test('exclude', t => {

   const app = {}

   lloader('app', app).set({
      'other': {
         'level': 6,
         "exclude": ['of.js', 'oo']
      },
   })

   lloader.load()
   
   t.ok(!app.other.of)
   t.ok(!app.other.oo)

   const { data, error } = typea.strict(app, {
      other: {
         index: Function,
         // oo: Object
      }
   })

   t.ok(data, error)

})