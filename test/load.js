"use strict"

const test = require('jmr')
const typea = require('typea')
const path = require('path')
const options = require('./options.js');

const appPath = path.join(process.cwd(), 'app');

const { Lloader } = test;

test('load', t => {

   const app = {};

   const lloader = new Lloader(appPath, app, options);

   lloader.add({
      "config": {
         "level": 1
      },
      "other": {
         "level": 6
      },
      "controller": {
         "level": 3
      },
      "model": {
         "level": 1
      }
   })
   
   lloader.load();

   const { data, error } = typea({
      config: {
         db: Object
      },
      controller: {
         a: Function,
         c1: { a: Function }
      },
      model: {
         m2: {}
      },
      helper: {
         db: Function,
         sub: {
            s1: Function,
            s2: Function
         }
      }
   }).strictVerify(app);

   t.ok(data, error)

})