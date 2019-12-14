"use strict";

const test = require('jtf');
const typea = require('typea');
const path = require('path');
const Lloader = require('..');
const base = require('./base.js');

const appPath = path.join(process.cwd(), 'app');

test('directory', t => {

   const app = {
      apps: {
         main: {
            config: {
               port: 8000
            }
         }
      }
   }

   const lloader = new Lloader(appPath, app, base);

   lloader.addLoads({
      "config": {
         "level": 0,
         after({ data }) {
            t.deepEqual(data, { db: { xx: 666 } });
         }
      },
      "model": {
         "level": 1
      },
      "controller": {
         "level": 3
      },
      "other": {
         "level": 6,
         directory(data) {
            return data;
         }
      },
   })

   Lloader.loadAll([lloader]);

   const { data, error } = typea({
      config: { db: Object },
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

   t.ok(data, error);

})