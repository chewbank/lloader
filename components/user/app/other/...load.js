'use strict';

module.exports = {
   config: {
      level: 1
   },
   model: {
      level: 2
   },
   middleware: {
      level: 3
   },
   controller: {
      level: 4,
      import(data) {
         return data
      }
   },
   other: {
      level: 6,
      import(data) {
         return data
      },
      complete(data) {
         return data
      }
   }
}