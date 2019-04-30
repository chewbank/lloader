"use strict";

const test = require('jtf')
const path = require('path')
const Lloader = require('..')

const appPath = path.join(process.cwd(), 'index');

test('module', t => {

   const app = {}

   const lloader = new Lloader(appPath, app);

   lloader.addLevels({
      "index.js": {
         "level": 1
      },
      "mm.js": {
         "level": 1
      },
   })

   Lloader.loadAll([lloader]);

   t.ok(true)

})