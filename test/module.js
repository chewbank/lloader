"use strict"

const test = require('jtf')
const typea = require('typea')
const path = require('path')
const lloader = require('..')

const appPath = path.join(process.cwd(), 'app');

test('module', t => {

   const app = {}

   lloader(appPath).load({
      "config": {
         "level": 1,
         before(data, container) {

         },
         after(data, container) {

         }
      },
      "model": {
         "level": 1,
         before(data, container) {

         }
      },
      "controller": {
         "level": 3
      },
      "other": {
         "level": 6,
         before(data, container) {
            // console.log('before', data, container)
         },
         module(data, name) {
            // console.log('other', name)
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
   }).save(app)

   lloader.loadAll()

   const { data, error } = typea.strict(app, {
      config: { db: Function },
      controller: {
         a: Function,
         c1: { a: Function }
      },
      model: Function,
      other: {
         oo: Object
      }
   })

   t.ok(data, error)

   t.ok(true)

})