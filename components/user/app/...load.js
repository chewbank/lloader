'use strict';

module.exports = {
   controllers: {
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