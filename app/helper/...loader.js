'use strict';

module.exports = {
   sub: {
      level: 2,
      // import(data) {
      //    console.log(`controllers import ${data}`)
      // },
      // complete(data) {
      //    console.log('controllers complete models')
      // }
   },
   'db.js': {
      level: 1,
      import(func) {
         return func()
      }
   }
}