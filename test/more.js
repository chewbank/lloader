"use strict"

const test = require('jtf')
const typea = require('typea')
const path = require('path')
const Lloader = require('..')

const appPath = path.join(process.cwd(), 'app');
const userPath = path.join(process.cwd(), 'user');

test('多目录', t => {

   const app = {};

   const lloader = new Lloader(appPath);

   lloader.load({
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
   }).save(app);

   const user = {};

   const lloader2 = new Lloader(userPath);

   lloader2.load({
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

   Lloader.loadAll([lloader, lloader2]);

   const { data, error } = typea.strict(app, {
      helper: {
         db: Function,
         sub: {
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