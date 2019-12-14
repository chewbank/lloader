"use strict"

const test = require('jtf')
const typea = require('typea')
const path = require('path')
const Lloader = require('..')
const base = require('./base.js');

const appPath = path.join(process.cwd(), 'app');
const userPath = path.join(process.cwd(), 'user');

test('多目录', t => {

   const app = {};

   const lloader = new Lloader(appPath, app, base);

   lloader.addLoads({
      "helper": {
         "level": 0
      },
   }).addLoads({
      "model": {
         "level": 20
      },
      "controller": {
         "level": 30
      }
   })

   const user = {};

   const lloader2 = new Lloader(userPath, user, base);

   lloader2.addLoads({
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

   Lloader.loadAll([lloader, lloader2]);

   const { data, error } = typea({
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
      model: {
         m2: Object
      },
   }).strictVerify(app);

   t.ok(data, error);

   const userReslut = typea({
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
      },
   }).strictVerify(user);

   t.ok(userReslut.data, userReslut.error);

})