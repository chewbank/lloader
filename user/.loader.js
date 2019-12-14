'use strict';

module.exports = {
   model: {
      level: 20,
      module(data) {
         return data
      }
   },
   controller: {
      level: 30,
      module(data) {
         return data
      }
   },
   other: {
      level: 40,
      module(data) {
         return data
      },
      directory(data) {
         return data
      }
   }
}