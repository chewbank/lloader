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