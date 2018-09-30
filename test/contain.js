"use strict"

const test = require('jtf')
const typea = require('typea')
const batchImport = require('..')

test('file', t => {

   const container = batchImport({
      "app": {
         "path": "app/",
         "contain": ['...load.js']
      }
   })

   t.ok(!container.controllers)

   const { data, error } = typea.strict(container, {
      '...load': Object,
      extend: {
         '...load': Object,
         'sub': {
            '...load': Object,
         }
      }
   })

   t.ok(data, error)

})


test('directory', t => {

   const container = batchImport({
      "app": {
         "path": "app/",
         "contain": ['extend'],
         import(name, data) {
            return data
         },
      }
   })

   t.ok(!container['...load'])
   t.ok(!container['abc.json'])
   t.ok(!container.controllers)
   t.ok(!container.models)

   const { data, error } = typea.strict(container, {
      extend: {
         '...load': Object,
         'sub': {
            '...load': Object,
            't2': 999
         },
         'db': Function
      }
   })

   t.ok(data, error)

})


test('directory + file', t => {

   const container = batchImport({
      "app": {
         "path": "app/",
         "contain": ['sub', '...load.js']
      }
   })

   t.ok(!container.models)
   
   const { data, error } = typea.strict(container, {
      '...load': Object,
      extend: {
         '...load': Object,
         'sub': {
            '...load': Object,
         }
      }
   })

   t.ok(data, error)

})