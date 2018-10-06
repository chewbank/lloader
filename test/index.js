"use strict"

const test = require('jtf')
const typea = require('typea')
const lloader = require('..')


test('app', t => {

   const app = {}

   lloader('app', app).set({
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

})


test('components', t => {

   const app = {}

   lloader('components/user', app).set({
      "other": {
         "level": 5
      },
      "controller": {
         "level": 3,
         module(data) {
            console.log(`module`)
         },
         directory(data) {
            console.log('directory')
         }
      }
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

   lloader('app', app).set({
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

   lloader('components/user', user).set({
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




