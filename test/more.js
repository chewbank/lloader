"use strict"

const test = require('jtf')
const typea = require('typea')
const path = require('path')
const lloader = require('..')

const appPath = path.join(process.cwd(), 'app');
const userPath = path.join(process.cwd(), 'apps/user');

test('多目录', t => {

   const app = {}

   lloader(appPath).load({
      "helper": {
         "level": 0
      },
   }).load({
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