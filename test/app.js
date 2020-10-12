"use strict";

const test = require('jmr');
const typea = require('typea');
const path = require('path');
const options = require('./options.js');

const appPath = path.join(process.cwd(), 'app');
const userPath = path.join(process.cwd(), 'user');

const { Lloader } = test;

test('app', t => {

   try {

      const app = { main: {} };

      const lloader = new Lloader(appPath, app, options);

      lloader.add({
         "helper": {
            "level": 0
         },
         "other": {
            "level": 0
         },
         "controller": {
            "level": 3
         },
         "model": {
            "level": 2
         },
         "database": {
            "level": 6
         },
      })

      Lloader.loadAll([lloader]);

      const { data, error } = typea({
         helper: {
            db: Function,
            sub: {
               ttf: {
                  index: {
                     tt: 5
                  },
                  jbp: {
                     "gg": 888
                  }
               },
               s1: Function,
               s2: Function
            }
         },
         config: { db: Object },
         controller: {
            a: Function,
            c1: { a: Function }
         },
         model: {
            m2: {}
         },
         database: {
            abc: {
               "name": String
            }
         }
      }).strictVerify(app);

      t.ok(data, error);

   } catch (error) {

      console.log(error);

   }

})


test('apps', t => {

   const app = {}

   const lloader = new Lloader(userPath, app, options);

   lloader.add({
      "controller": {
         "level": 3,
         module(data) {
            // console.log(`module`)
            return data;
         },
         directory(data) {
            return data;
            // console.log('directory')
         }
      },
      "other": {
         "level": 5
      },
   })

   Lloader.loadAll([lloader]);

   const { data, error } = typea({
      controller: {
         a: Function,
         c1: { a: Function }
      },
      other: {
         db: Function,
         sub: { s1: Function, s2: Function }
      },
      model: {
         index: Function
      }
   }).strictVerify(app);

   t.ok(data, error);

})