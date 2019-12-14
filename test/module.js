"use strict"

const test = require('jtf');
const typea = require('typea');
const path = require('path');
const Lloader = require('..');
const base = require('./base.js');

const appPath = path.join(process.cwd(), 'app');

test('module', t => {

   const app = {}

   const lloader = new Lloader(appPath, app, base);

   lloader.addLoads({
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
         before(container) {
            // console.log('before', container)
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
   })

   Lloader.loadAll([lloader]);

   const { data, error } = typea({
      config: { db: Object },
      controller: {
         a: Function,
         c1: { a: Function }
      },
      model: {
         m2: {}
      },
      other: {
         oo: Object
      }
   }).strictVerify(app);

   t.ok(data, error)

})