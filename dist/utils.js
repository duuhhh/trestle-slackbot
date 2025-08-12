"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffle = shuffle;
exports.findAsync = findAsync;
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function findAsync(arr_1, asyncCallback_1) {
  return __awaiter(
    this,
    arguments,
    void 0,
    function* (arr, asyncCallback, syncExecution = true) {
      if (syncExecution) {
        for (const element of arr) {
          const result = yield asyncCallback(element);
          if (result) return element;
        }
      } else {
        const promises = arr.map(asyncCallback);
        const results = yield Promise.all(promises);
        const index = results.findIndex((result) => result);
        return arr[index];
      }
    }
  );
}
//# sourceMappingURL=utils.js.map
