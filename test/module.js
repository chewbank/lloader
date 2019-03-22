"use strict"

const test = require('jtf')
const typea = require('typea')
const path = require('path')
const Lloader = require('..')

const appPath = path.join(process.cwd(), 'app');

test('module', t => {

   const app = {}

   const lloader = new Lloader(appPath);

   lloader.load({
      "config": {
         "level": 1
      },
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
         module(data, name) {
            // console.log('other', name)
            return data
         },
         directory(data, name) {
            // console.log('directory', name)
            return data
         },
      },
   }).save(app);

   Lloader.loadAll([lloader]);

   const { data, error } = typea.strict(app, {
      config: { db: Object },
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