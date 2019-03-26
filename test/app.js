"use strict"

const test = require('jtf')
const typea = require('typea')
const path = require('path')
const Lloader = require('..')

const appPath = path.join(process.cwd(), 'app');
const userPath = path.join(process.cwd(), 'user');

test('app', t => {

   try {

      const app = {};

      const lloader = new Lloader(appPath, app);

      lloader.load({
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
      })

      Lloader.loadAll([lloader]);

      const { data, error } = typea.strict(app, {
         helper: {
            db: Function,
            sub: {
               ttf: {
                  tt: Number
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
         model: Function
      });

      t.ok(data, error);

   } catch (error) {

      console.log(error);

   }

})


test('apps', t => {

   const app = {}

   const lloader = new Lloader(userPath, app);

   lloader.load({
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

   const { data, error } = typea.strict(app, {
      controller: {
         a: Function,
         c1: { a: Function }
      },
      other: {
         db: Function,
         sub: { s1: Function, s2: Function }
      },
      model: Function
   })

   t.ok(data, error)

})