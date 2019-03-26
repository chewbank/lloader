"use strict"

const test = require('jtf')
const path = require('path')
const Lloader = require('..')

const appPath = path.join(process.cwd(), 'index');

test('module', t => {

   const app = {}

   const lloader = new Lloader(appPath, app);

   lloader.load({
      "index.js": {
         "level": 1
      },
      "mm.js": {
         "level": 1
      },
   })

   Lloader.loadAll([lloader]);

   console.log(app)

   t.ok(true)

})