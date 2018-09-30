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
      "controllers": {
         "level": 3
      },
      "models": {
         "level": 2
      }
   })

   lloader.load()

   const { data, error } = typea.strict(app, {
      helper: {
         db: { xx: 666 },
         sub: {
            s1: Function,
            s2: Function
         }
      },
      config: { db: Function },
      controllers: {
         a: Function,
         c1: { a: Function },
         index: Function
      },
      models: { index: Function }
   })

   t.ok(data, error)

})


test('components', t => {

   const app = {}

   lloader('components/user/app', app).set({
      "other": {
         "level": 5
      },
      "controllers": {
         "level": 3,
         import(name) {
            console.log(`import ${name}`)
         },
         complete(data) {
            console.log('complete models')
         }
      }
   })

   lloader.load()

   const { data, error } = typea.strict(app, {
      controllers: {
         a: Function,
         c1: { dds: 588 },
         index: Function
      },
      other: {
         db: Function,
         sub: { s1: Function, s2: Function }
      },
      models: { 
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
      "controllers": {
         "level": 3
      },
      "models": {
         "level": 2
      }
   })


   const user = {}

   lloader('components/user/app', user).set({
      "other": {
         "level": 5
      },
      "controllers": {
         "level": 3,
         import(name) {
            console.log(`import ${name}`)
         },
         complete(data) {
            console.log('complete models')
         }
      }
   })

   lloader.load()

   const { data, error } = typea.strict(app, {
      helper: {
         db: { xx: 666 },
         sub: {
            s1: Function,
            s2: Function
         }
      },
      config: { db: Function },
      controllers: {
         a: Function,
         c1: { a: Function },
         index: Function
      },
      models: { index: Function }
   })

   t.ok(data, error)


   const userReslut = typea.strict(user, {
      controllers: {
         a: Function,
         c1: { dds: 588 },
         index: Function
      },
      other: {
         db: Function,
         sub: { s1: Function, s2: Function }
      },
      models: { 
         index: Function
       }
   })

   t.ok(userReslut.data, userReslut.error)

})




