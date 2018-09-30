'use strict';

module.exports = {
   controllers: {
      level: 4,
      import(name, data) {
         return data
      }
   },
   other: {
      level: 6,
      import(name, data) {
         return data
      },
      complete(data) {
         return data
      }
   }
}