'use strict';

module.exports = {
   controller: {
      level: 4,
      module(data) {
         return data
      }
   },
   other: {
      level: 6,
      module(data) {
         return data
      },
      directory(data) {
         return data
      }
   }
}