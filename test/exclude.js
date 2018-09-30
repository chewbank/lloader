"use strict"

const test = require('jtf')
const typea = require('typea')
const batchImport = require('..')

test('file', t => {

   const container = batchImport({
      "controllers": {
         "path": "app/controllers",
         "exclude": ['a.js']
      }
   })

   t.ok(!container.extend)
   t.ok(!container.models)
   t.ok(!container.controllers['a.js'])

   const { data, error } = typea.strict(container, {
      controllers: {
         index: Function,
         sub: {
            sc: Function
         }
      }
   })

   t.ok(data, error)

})

test('directory', t => {

   const container = batchImport({
      "models": {
         "path": "app/models",
         "exclude": ['sub']
      }
   })

   t.ok(!container.controllers)
   t.ok(!container.extend)
   t.ok(!container.models['sub'])

   const { data, error } = typea.strict(container, {
      models: {
         index: Function,
         md: Function,
         sb: { mj: Function }
      }
   })

   t.ok(data, error)

})

test('directory + file', t => {

   const container = batchImport({
      "controllers": {
         "path": "app/controllers",
         "exclude": ['a.js']
      },
      "models": {
         "path": "app/models",
         "exclude": ['sub']
      }
   })

   t.ok(!container.extend)

   const { data, error } = typea.strict(container, {
      controllers: {
         index: Function,
         sub: {
            sc: Function
         }
      },
      models: {
         index: Function,
         md: Function,
         sb: { mj: Function }
      }
   })

   t.ok(data, error)

})