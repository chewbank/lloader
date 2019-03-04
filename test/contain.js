"use strict"

const test = require('jtf')
const typea = require('typea')
const path = require('path')
const lloader = require('..')

const appPath = path.join(process.cwd(), 'app');

test('contain', t => {

   const app = {}

   lloader(appPath, app).set({
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