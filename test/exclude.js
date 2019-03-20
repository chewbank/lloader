"use strict"

const test = require('jtf')
const typea = require('typea')
const path = require('path')
const lloader = require('..')

const appPath = path.join(process.cwd(), 'app');

test('exclude', t => {

   const app = {}

   lloader(appPath).load({
      'other': {
         'level': 6,
         "exclude": ['of', 'oo']
      },
   }).save(app)

   lloader.loadAll()

   t.ok(!app.other.of)
   t.ok(!app.other.oo)

   const { data, error } = typea.strict(app, {
      other: {}
   })

   t.ok(data, error)

})