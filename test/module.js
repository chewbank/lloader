"use strict"

const test = require('jtf')
const typea = require('typea')
const lloader = require('..')

test('module', t => {

   const app = {}

   lloader('app', app).set({
      "model": {
         "level": 1
      },
      "controller": {
         "level": 3
      },
      "other": {
         "level": 6,
         before(data, container) {
            // console.log('before', data, container)
         },
         module(data) {
            // console.log('module')
            return data
         },
         directory(data, name) {
            // console.log('directory', name)
            return data
         },
         after(data, container) {
            // console.log('after data', data)
            // console.log('after container', container)
         },
      },
   })

   lloader.load()

   const { data, error } = typea.strict(app, {
      config: { db: Function },
      controller: {
         a: Function,
         c1: { a: Function },
         index: Function
      },
      model: { index: Function },
      other: {
         oo: Object,
         index: Object
      }
   })

   t.ok(data, error)

})