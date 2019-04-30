"use strict";

const test = require('jtf')
const typea = require('typea')
const path = require('path')
const Lloader = require('..')

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

   const lloader = new Lloader(appPath, app);

   lloader.addLevels({
      "config": {
         "level": 0,
         after(app) {
            // const { main } = app.apps;
            // Object.assign(app.config, main.config);
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

   const { data, error } = typea.strict(app, {
      config: { db: Object },
      controller: {
         a: Function,
         c1: { a: Function }
      },
      model: Function,
      helper: {
         db: Function,
         sub: {
            s1: Function,
            s2: Function
         }
      }
   })

   t.ok(data, error)

})