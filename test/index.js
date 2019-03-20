"use strict"

const test = require('jtf')
const typea = require('typea')
const path = require('path')
const lloader = require('..')

const appPath = path.join(process.cwd(), 'app');
const userPath = path.join(process.cwd(), 'apps/user');

test('app', t => {

   try {

      const app = {};

      t.deepEqual(lloader.nodes, []);

      lloader(appPath).load({
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
         }
      }).save(app);

      lloader.loadAll();

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
         config: { db: Function },
         controller: {
            a: Function,
            c1: { a: Function }
         },
         model: Function
      })

      t.ok(data, error);

   } catch (error) {

      console.log(error);

   }

})


test('apps', t => {

   const app = {}

   lloader(userPath).load({
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
   }).save(app)

   lloader.loadAll();

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


test('mixin', t => {

   const app = {}

   lloader(appPath).load({
      "helper": {
         "level": 0
      },
      "model": {
         "level": 20
      },
      "controller": {
         "level": 30
      }
   }).save(app)


   const user = {}

   lloader(userPath).load({
      "controller": {
         "level": 30,
         module(data) {
            return data
         },
         directory(data) {
            return data
         }
      },
      "other": {
         "level": 40
      },
   }).save(user)

   lloader.loadAll()

   const { data, error } = typea.strict(app, {
      helper: {
         db: Function,
         sub: {
            s1: Function,
            s2: Function
         }
      },
      config: { db: Function },
      controller: {
         a: Function,
         c1: { a: Function }
      },
      model: Function
   })

   t.ok(data, error)

   const userReslut = typea.strict(user, {
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

   t.ok(userReslut.data, userReslut.error)

})