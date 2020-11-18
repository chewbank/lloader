"use strict";

const test = require('jmr');
const typea = require('@chewbank/typea');
const path = require('path');

const { Lloader } = test;

const appPath = path.join(process.cwd(), 'app');


test('action', t => {

  const app = { s: 1 };

  const lloader = new Lloader(appPath, app);

  lloader.add({
    "test": {
      "level": 10,
      before({ root }) {
        // console.log(root);
      },
      action({ data }) {
        return 666;
      }
    },
    "abs": {
      "level": 20,
      action() {
        return [
          {
            a: 1,
            b: 2
          }
        ];
      }
    }
  })

  Lloader.loadAll([lloader]);

  const { data, error } = typea({
    s: 1,
    test: 666,
    abs: [{ a: 1, b: 2 }]
  }).strictVerify(app);

  t.ok(data, error);

})