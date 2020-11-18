"use strict"

const test = require('jmr');
const typea = require('@chewbank/typea');
const path = require('path');
const options = require('./options.js');

const { Lloader } = test;

const appPath = path.join(process.cwd(), 'app');

test('module', t => {

  const app = {}

  const lloader = new Lloader(appPath, app, options);

  lloader.add({
    "config": {
      "level": 1
    },
    "model": {
      "level": 1
    },
    "controller": {
      "level": 3
    },
    "other": {
      "level": 6,
      before(container) {
        // console.log('before', container)
      },
      module(data, name) {
        // console.log('other', name)
        return data
      },
      directory(data, name) {
        // console.log('directory', name)
        return data
      },
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
    other: {
      oo: Object
    }
  }).strictVerify(app);

  t.ok(data, error)

})