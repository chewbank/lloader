'use strict';

module.exports = {
   sub: {
      level: 2,
      // import(name) {
      //    console.log(`controllers import ${name}`)
      // },
      // complete(data) {
      //    console.log('controllers complete models')
      // }
   },
   'db.js': {
      level: 1,
      import(name, func) {
         return func()
      }
   }
}