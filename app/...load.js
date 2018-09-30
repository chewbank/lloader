'use strict';

module.exports = {
   'config': {
      level: 1
   },
   'models': {
      level: 8
   },
   'controllers': {
      level: 4,
      // import(name) {
      //    console.log(`controllers import ${name}`)
      // },
      // complete(data) {
      //    console.log('controllers complete models')
      // }
   },
   'typea': {
      level: 5
   },
   'other': {
      level: 6,
      complete(data) {

      }
   },
   'bb.js': {
      level: 3,
      // import(name) {
      //    console.log(name)
      // }
   },
   'fl.js': false
}