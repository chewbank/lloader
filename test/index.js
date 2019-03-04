"use strict"

const test = require('jtf')
const typea = require('typea')
const path = require('path')
const lloader = require('..')

const appPath = path.join(process.cwd(), 'app');
const userPath = path.join(process.cwd(), 'apps/user');

test('app', t => {

   const app = {}

   t.deepEqual([], lloader.directorys)

   lloader(appPath, app).set({
      "helper": {
         "level": 0
      },
      "controller": {
         "level": 3
      },
      "model": {
         "level": 2
      }
   })

   let [item] = lloader.directorys

   t.deepEqual({
      helper: { level: 0 },
      controller: { level: 3 },
      model: { level: 2 }
   }, item.subset)

   lloader.load()

   t.deepEqual([], lloader.directorys)

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
         c1: { a: Function },
         index: Function
      },
      model: { index: Function }
   })

   t.ok(data, error)

})



test('apps', t => {

   const app = {}


   lloader(userPath, app).set({
      "controller": {
         "level": 3,
         module(data) {
            console.log(`module`)
         },
         directory(data) {
            console.log('directory')
         }
      },
      "other": {
         "level": 5
      },
   })

   lloader.load()

   const { data, error } = typea.strict(app, {
      controller: {
         a: Function,
         c1: { a: Function },
         index: Function
      },
      other: {
         db: Function,
         sub: { s1: Function, s2: Function }
      },
      model: {
         index: Function
      }
   })

   t.ok(data, error)

})


test('mixin', t => {

   const app = {}

   lloader(appPath, app).set({
      "helper": {
         "level": 0
      },
      "model": {
         "level": 20
      },
      "controller": {
         "level": 30
      }
   })


   const user = {}

   lloader(userPath, user).set({
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
   })

   lloader.load()

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
         c1: { a: Function },
         index: Function
      },
      model: { index: Function }
   })

   t.ok(data, error)


   const userReslut = typea.strict(user, {
      controller: {
         a: Function,
         c1: { a: Function },
         index: Function
      },
      other: {
         db: Function,
         sub: { s1: Function, s2: Function }
      },
      model: {
         index: Function
      }
   })

   t.ok(userReslut.data, userReslut.error)

})




