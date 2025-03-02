// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{}],"module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PopUpMessage = PopUpMessage;
exports.StringtoInt = StringtoInt;
exports.calprojectpercent = calprojectpercent;
exports.checkBlank = checkBlank;
exports.datetransfer = datetransfer;
exports.default = void 0;
exports.detailpicture = detailpicture;
exports.getAllUser = getAllUser;
exports.getColor = getColor;
exports.getMonthlyMoney = getMonthlyMoney;
exports.getProjectMoney = getProjectMoney;
exports.getTodayMoney = getTodayMoney;
exports.getaprojectmoney = getaprojectmoney;
exports.gettabledata = gettabledata;
exports.sergetProject = sergetProject;

require("regenerator-runtime/runtime.js");

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var today = new Date();

function gettabledata(table, parameter, row) {
  var result = JSON.stringify(table[row]);
  result = JSON.parse(result);
  result = result[parameter];
  return result;
}

function getTodayMoney(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
  return _getTodayMoney.apply(this, arguments);
}

function _getTodayMoney() {
  _getTodayMoney = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(ID, table, year, month, date, selection, type) {
    var results;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            results = 0;
            _context.next = 3;
            return $.get('./todaymoney', {
              id: ID,
              table: table,
              selection: selection,
              month: month,
              date: date,
              year: year,
              type: type
            }, function (data) {
              var result = 0;

              if (_typeof(data) != String) {
                var total = 0;

                for (var i in data) {
                  total += StringtoInt(gettabledata(data, "".concat(selection), i));
                  i++;
                }

                result = total;
              } else {
                result = 0;
              }

              results = result;
            });

          case 3:
            return _context.abrupt("return", results);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getTodayMoney.apply(this, arguments);
}

function getMonthlyMoney(_x8, _x9, _x10, _x11) {
  return _getMonthlyMoney.apply(this, arguments);
} //need to check what is the detail in table


function _getMonthlyMoney() {
  _getMonthlyMoney = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(ID, table, selection, type) {
    var results, today;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            results = 0;
            today = new Date();
            _context2.next = 4;
            return $.get('./monthlymoney', {
              ID: ID,
              table: table,
              selection: selection,
              month: datetransfer(today.getMonth() + 1),
              year: StringtoInt(today.getFullYear()),
              type: type
            }, function (data) {
              var result = 0;

              if (_typeof(data) != String) {
                var total = 0;

                for (var i in data) {
                  total += StringtoInt(gettabledata(data, "".concat(selection), i));
                  i++;
                }

                result = total;
              } else {
                result = 0;
              }

              results = result;
            });

          case 4:
            return _context2.abrupt("return", results);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getMonthlyMoney.apply(this, arguments);
}

function getProjectMoney(_x12) {
  return _getProjectMoney.apply(this, arguments);
}

function _getProjectMoney() {
  _getProjectMoney = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(ID) {
    var results;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            results = 0;
            _context3.next = 3;
            return $.get('./getProject', {
              ID: ID
            }, function (data) {
              var totalremain = 0;
              console.log(data);

              for (var i in data) {
                var lastday = new Date("".concat(gettabledata(data, "end_month", i), "/").concat(gettabledata(data, "end_day", i), "/").concat(gettabledata(data, "end_year", i)));
                var startday = new Date();

                if (lastday - startday < 0) {
                  continue;
                }

                var remainday = Math.abs(lastday - startday);

                if (remainday > 0 || remainday !== undefined || StringtoInt(gettabledata(data, 'personal_or_joint', i)) > 0) {
                  remainday = Math.ceil(remainday / (1000 * 3600 * 24)) + 1;
                  var money = StringtoInt(gettabledata(data, "target_number", i)) / StringtoInt(gettabledata(data, 'personal_or_joint', i)) - StringtoInt(gettabledata(data, "saved_money", i)); //0 is for simulating money already save for this project

                  if (money > 0) {
                    money = money / remainday;
                    totalremain += money;
                  } else {
                    checkProjectComplete(data, i);
                  }
                } else continue;
              }

              results = totalremain;
            });

          case 3:
            return _context3.abrupt("return", results);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getProjectMoney.apply(this, arguments);
}

function checkProjectComplete(data, i) {
  $.get('./projectcomplete', {
    ID: gettabledata(data, 'id', i),
    project_name: gettabledata(data, 'project_name', i),
    color: gettabledata(data, 'color', i),
    target_number: gettabledata(data, 'target_number', i),
    member: gettabledata(data, 'member', i)
  }, function (data) {
    console.log(data);
  });
}

function calprojectpercent(_x13, _x14) {
  return _calprojectpercent.apply(this, arguments);
}

function _calprojectpercent() {
  _calprojectpercent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(ID, project_name) {
    var result;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            result = 0;
            _context4.next = 3;
            return $.get('./getproject', {
              ID: ID
            }, function (data) {
              for (var i in data) {
                if (project_name === data[i].project_name) {
                  result = StringtoInt(gettabledata(data, 'saved_money', i)) / StringtoInt(gettabledata(data, 'target_number', i));
                  result = result / 100;
                }
              }
            });

          case 3:
            return _context4.abrupt("return", Math.round(result, -1));

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _calprojectpercent.apply(this, arguments);
}

function StringtoInt(x) {
  var parsed = parseInt(x, 10);

  if (isNaN(parsed)) {
    return 0;
  }

  return parsed;
}

function datetransfer(date) {
  if (StringtoInt(date) < 10) {
    date = "0".concat(date);
  } else {
    date = date;
  }

  return date;
}

function checkBlank(page) {
  var lengths = 1;
  var recordmessage = ["項目", "日期", "金額", "分類", "帳戶", "類別"];
  var projectmessage = ["專案名稱", "日期", "目標金額"];
  var financial = ["type", "ITEM", "YEAR", "MONTH", "DAY", "MONEY", "REPEAT"];
  var account = ["NAME", "CURRENCY", "MONEY"];
  var pages = [];

  switch (page) {
    case 'record':
      pages = recordmessage;
      break;

    case 'project':
      pages = projectmessage;
      break;

    case 'financial':
      pages = financial;

    case 'account':
      pages = account;
      break;
  }

  for (var _len = arguments.length, input = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    input[_key - 1] = arguments[_key];
  }

  for (var j = 0; j < input.length; j++) {
    lengths = lengths * (input[j].length - 2);

    if (lengths === 0) {
      return pages[j];
    }

    if (lengths > 1 && j === input.length - 1) {
      return 1;
    }
  }
}

function PopUpMessage(type) {
  if (type < 5) {
    var PopUpTital = ['恭喜本月已存下xx元', '恭喜完成專案！', '請輸入完整資訊', '功能待開發！', '已成功新增！'];
    var PopUpGif = ['pig', 'congrate', 'eye', 'glasses', 'added'];
    $('#popup .box_login, #popup .box_delete').css('display', 'none');
    $('#popup .box_regular').css('display', 'flex');
    $('#popup').css('display', 'flex');
    $('#popup #background .box_regular .message p').html("".concat(PopUpTital[type]));
    $('#popup #background .box_regular .message figure img').attr("src", "./image/PopUpMessage/PopUpMessage_".concat(PopUpGif[type], ".gif"));
  } else if (type == 5) {
    $('#popup .box_regular, #popup .box_delete').css('display', 'none');
    $('#popup .box_login').css('display', 'flex');
    $('#popup').css('display', 'flex');
  } else {
    $('#popup .box_regular, #popup .box_login').css('display', 'none');
    $('#popup .box_delete').css('display', 'flex');
    $('#popup').css('display', 'flex');
  }
}

function getAllUser() {
  return _getAllUser.apply(this, arguments);
}

function _getAllUser() {
  _getAllUser = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
    var all_user, buffer, i;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            all_user = [];
            _context5.next = 3;
            return $.get('./getAllUser', {}, function (data) {
              all_user = data;
            });

          case 3:
            buffer = '';

            for (i = 0; i < all_user.length; i++) {
              if (all_user[i] == buffer) {
                all_user.splice(i, 1);
                i = JSON.stringify(i - 1);
              } else {
                buffer = all_user[i];
              }
            }

            console.log(all_user);
            return _context5.abrupt("return", all_user);

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _getAllUser.apply(this, arguments);
}

function sergetProject(_x15) {
  return _sergetProject.apply(this, arguments);
}

function _sergetProject() {
  _sergetProject = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(user) {
    var all_project;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return $.get('./sergetProject', {
              user: user
            }, function (data) {
              all_project = data;
              all_project = all_project.sort(function (a, b) {
                return a.remainday - b.remainday;
              });
            });

          case 2:
            return _context6.abrupt("return", all_project);

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _sergetProject.apply(this, arguments);
}

function getColor(color) {
  var ColorCode = ['#F42850', '#F6A93B', '#F4EC28', '#7ED321', '#4A90E2', '#8E5FF4', '#FC75CE'];
  var ColorImgSrc = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];

  for (var i = 0; i < 7; i++) {
    if (color === ColorCode[i]) {
      return ColorImgSrc[i];
    }
  }
}

function detailpicture(data, type) {
  var exptype = ['飲食', '購物', '家居', '個人', '交通', '娛樂', '醫療', '其他'];
  var intype = ['薪水', '獎金', '投資', '還款', '中獎', '利息', '其他'];
  var exppicture = ['food', 'shopping', 'house', 'personal', 'transport', 'entertainment', 'hospital', 'other'];
  var inpicture = ['salary', 'bonus', 'investment', 'repayment', 'win', 'intersest', 'other'];

  if (type == '0') {
    for (var i in exptype) {
      if (exptype[i] == data) {
        return exppicture[i];
      }
    }
  }

  if (type == '1') {
    for (var i in intype) {
      if (intype[i] == data) {
        return inpicture[i];
      }
    }
  }
}

function getaprojectmoney(_x16, _x17, _x18, _x19) {
  return _getaprojectmoney.apply(this, arguments);
}

function _getaprojectmoney() {
  _getaprojectmoney = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(id, project_name, color, target_number) {
    var result;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            result = 0;
            _context7.next = 3;
            return $.get('./getaprojectmoney', {
              id: id,
              project_name: project_name,
              color: color,
              target_number: target_number
            }, function (data) {
              result = data;
            });

          case 3:
            return _context7.abrupt("return", result);

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _getaprojectmoney.apply(this, arguments);
}

var _default = {
  gettabledata: gettabledata,
  // get id inside the row of column select from database
  getMonthlyMoney: getMonthlyMoney,
  // get money in each table, remember to use caltotalmoney to get in integer
  getProjectMoney: getProjectMoney,
  // get daily project saving
  calprojectpercent: calprojectpercent,
  // calculate project complete %(in .1f )
  StringtoInt: StringtoInt,
  // transfer string to integer
  datetransfer: datetransfer,
  // tranfer date to 0date if date<10
  checkBlank: checkBlank,
  // check if there is a blank in input. Need to input all input to check, and it will return 1 for all inputs are filled
  getAllUser: getAllUser,
  // get all users' id
  sergetProject: sergetProject,
  // FOR SERVER TO GET PROJECT
  PopUpMessage: PopUpMessage,
  // popup message, need to input the word you want to show
  getColor: getColor,
  // turn the color code into the color, need to input the color code of the project
  detailpicture: detailpicture,
  //return detail's picture's name
  getaprojectmoney: getaprojectmoney //use to get a project saved money

};
exports.default = _default;
},{"regenerator-runtime/runtime.js":"../node_modules/regenerator-runtime/runtime.js"}],"selectormodule.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InitialColor = InitialColor;
exports.default = void 0;

var mod = _interopRequireWildcard(require("./module.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ID = localStorage.getItem("ID");
var TIME = new Date(); // --------------- color selector in project ---------------

var COLOR = '#F6A93B'; // project color
// open/close color_select_box

$('#add_project .box:nth-child(2) .color_selector').click(function () {
  $('.color_select_box').css("display", "flex");
  setTimeout(function () {
    $('.color_select_box').css("transform", "translateY(0%)");
    document.addEventListener("click", clickHiddenColorBox);
  }, 100);
});

function clickHiddenColorBox(eve) {
  if (eve.target.class != "color_select_box") {
    $('.color_select_box').css("transform", "translateY(100%)");
    setTimeout(function () {
      $('.color_select_box').css("display", "none");
    }, 500);
  }

  document.removeEventListener("click", clickHiddenColorBox);
} // setting project color


var ColorCode = ['#F42850', '#F6A93B', '#F4EC28', '#7ED321', '#4A90E2', '#8E5FF4', '#FC75CE'];
var ColorImgSrc = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];

var _loop = function _loop(i) {
  $('.color_select_box #color_bar img:nth-child(' + "".concat(i) + ')').click(function () {
    COLOR = ColorCode[i - 1];
    $('#add_project .box:nth-child(2) .color_selector img:nth-child(1)').attr("src", "./image/project/Project_colordot_" + "".concat(ColorImgSrc[i - 1]) + ".png");
  });
};

for (var i = 1; i < 8; i++) {
  _loop(i);
} // initial the color (orange)


function InitialColor() {
  COLOR = '#F6A93B';
  return;
} // transmit the COLOR to other project


function transmitCOLOR() {
  // I'm not sure it need 'export' or not
  return COLOR;
}

; // ------------------ number keyboard selector ------------------

var money = '';
var t = document.getElementById("spend"); // open number keyboard selector

$('#spend').click(function () {
  $('.NumKeyBoard_select_box').css("display", "flex");
  setTimeout(function () {
    $('.NumKeyBoard_select_box').css("transform", "translateY(0%)");
  }, 100);
  document.activeElement.blur();
}); // let every number a button to print number

$('#zero').click(function () {
  money = money + "0";
  t.value = money;
});
$('#one').click(function () {
  money = money + "1";
  t.value = money;
});
$('#two').click(function () {
  money = money + "2";
  t.value = money;
});
$('#three').click(function () {
  money = money + "3";
  t.value = money;
});
$('#four').click(function () {
  money = money + "4";
  t.value = money;
});
$('#five').click(function () {
  money = money + "5";
  t.value = money;
});
$('#six').click(function () {
  money = money + "6";
  t.value = money;
});
$('#seven').click(function () {
  money = money + "7";
  t.value = money;
});
$('#eight').click(function () {
  money = money + "8";
  t.value = money;
});
$('#nine').click(function () {
  money = money + "9";
  t.value = money;
});
$('#backspace').click(function () {
  money = money.slice(0, -1);
  t.value = money;
});
$('#ok').click(function () {
  // close number keyboard selector
  $('.NumKeyBoard_select_box').css("transform", "translateY(100%)");
  setTimeout(function () {
    $('.NumKeyBoard_select_box').css("display", "none");
    money = '';
  }, 500);
}); // ------------------ expend and income sort selector box ------------------

var click_op = 0;

var _loop2 = function _loop2(_i) {
  $("#add_deals #type p:nth-child(".concat(_i, ")")).click(function () {
    if (_i !== 4) {
      if (_i === 1) {
        click_op = 2;
      } else if (_i === 2) {
        click_op = 1;
      } else {
        click_op = 0;
      }
    }
  });
};

for (var _i = 1; _i < 5; _i++) {
  _loop2(_i);
} // open/close sort_select_box


$('#add_deals #fin .box:nth-child(3) .input_div').click(function () {
  if (click_op < 2) {
    $('.sort_select_box').css("display", "flex");
    setTimeout(function () {
      $('.sort_select_box').css("transform", "translateY(0%)");
      document.addEventListener("click", clickHiddenSortBox);
    }, 100);
  }
});

function clickHiddenSortBox(eve) {
  if (eve.target.class != "sort_select_box") {
    $('.sort_select_box').css("transform", "translateY(100%)");
    setTimeout(function () {
      $('.sort_select_box').css("display", "none");
    }, 500);
  }

  document.removeEventListener("click", clickHiddenSortBox);
}

var ExpendSortName = ['飲食', '購物', '家居', '個人', '交通', '娛樂', '醫療', '其他'];
var IncomeSortName = ['薪水', '獎金', '投資', '還款', '中獎', '利息', '其他'];
var ExpendSortImage = ['food', 'shopping', 'house', 'personal', 'transport', 'entertainment', 'hospital', 'other'];
var IncomeSortImage = ['salary', 'bonus', 'investment', 'repayment', 'win', 'intersest', 'other'];
$('#expend, #add_deals_btn').click(function (event) {
  CreateSortBox(ExpendSortImage, ExpendSortName);
});
$('#income').click(function (event) {
  CreateSortBox(IncomeSortImage, IncomeSortName);
});

function CreateSortBox(image, name) {
  var container = document.querySelector('.sort_select_box .sort_bar');
  container.innerHTML = "<div></div>";
  var ImageList = image;
  var NameList = name;

  for (var _i2 = 0; _i2 < ImageList.length; _i2++) {
    var block = document.createElement('div');
    var ImageBox = document.createElement('img');
    var NameBox = document.createElement('p');
    block.setAttribute("class", "sort_box");
    ImageBox.setAttribute("src", "./image/Accounting/".concat(ImageList[_i2], "_icon.png"));
    ImageBox.setAttribute("width", "100%");
    NameBox.textContent = "".concat(NameList[_i2]);
    container.appendChild(block);
    block.appendChild(ImageBox);
    block.appendChild(NameBox);
  }

  var _loop3 = function _loop3(_i3) {
    $(".sort_select_box .sort_bar .sort_box:nth-child(".concat(_i3, ")")).click(function () {
      var sort_word = $(".sort_select_box .sort_bar .sort_box:nth-child(".concat(_i3, ") p")).text();
      $('#add_deals #fin #sort').html("".concat(sort_word));
    });
  };

  for (var _i3 = 2; _i3 < 10; _i3++) {
    _loop3(_i3);
  }
} // ------------------ other selector boxs ------------------
// open/close other_select_box


$('#add_financial_page .box:nth-child(4) .repeat_div, #add_account_page .box:nth-child(2) .currency_div').click(function () {
  $('.other_select_box').css("display", "flex");
  setTimeout(function () {
    $('.other_select_box').css("transform", "translateY(0%)");
    document.addEventListener("click", clickHiddenOtherBox);
  }, 100);
});
$('#add_deals #fin #acc_div').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
  return _regeneratorRuntime().wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return CreateOtherBox(Account, AccountDiv);

        case 2:
          $('.other_select_box').css("display", "flex");
          setTimeout(function () {
            $('.other_select_box').css("transform", "translateY(0%)");
            document.addEventListener("click", clickHiddenOtherBox);
          }, 100);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));
$('#add_deals #fin #sort_div').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
  return _regeneratorRuntime().wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return CreateOtherBox(Project, ProjectDiv);

        case 2:
          if (click_op === 2) {
            $('.other_select_box').css("display", "flex");
            setTimeout(function () {
              $('.other_select_box').css("transform", "translateY(0%)");
              document.addEventListener("click", clickHiddenOtherBox);
            }, 100);
          }

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
})));

function clickHiddenOtherBox(eve) {
  if (eve.target.class != "other_select_box") {
    $('.other_select_box').css("transform", "translateY(100%)");
    setTimeout(function () {
      $('.other_select_box').css("display", "none");
    }, 500);
  }

  document.removeEventListener("click", clickHiddenOtherBox);
}

var Repeat = ['重複循環', '不重複', '每天', '每週', '每月', '每年', '自訂'];
var RepeatDiv = '#add_financial_page #financial .box:nth-child(4) .repeat_div p';
var Currency = ['幣種', 'USD-美元', 'AUD-澳幣', 'JPY-日圓', 'TWD-台幣', 'KRW-韓元', 'CNY-人民幣'];
var CurrencyDiv = '#add_account_page #account_form .box:nth-child(2) .currency_div p';
var Project = ['請選擇專案', '一般儲蓄'];
var ProjectDiv = '#add_deals #fin #sort';
var Account = ['請選擇帳戶'];
var AccountDiv = '#add_deals #fin #acc';
$(document).ready(function () {
  // get project name
  $('#add_deals_btn').click(function (event) {
    event.preventDefault();
    $.get('./getProject', {
      ID: ID
    }, function (data) {
      var j = 2;

      if ("".concat(data) !== "nothing") {
        for (var _i4 in data) {
          var project_name = mod.gettabledata(data, 'project_name', _i4);
          Project[j] = "".concat(project_name);
          j++;
        }

        console.log(Project);
      } else {
        console.log('no project');
      }

      ;
    });
  }); // get all account

  $('#add_deals_btn').click(function (event) {
    event.preventDefault();
    $.get('./getAccount', {
      ID: ID
    }, function (data) {
      var j = 1;

      if ("".concat(data) !== "nothing") {
        for (var _i5 in data) {
          var account_name = mod.gettabledata(data, 'name', _i5);
          Account[j] = "".concat(account_name);
          j++;
        }

        console.log(Account);
      } else {
        Account[1] = '（尚未新增帳戶）';
        console.log(Account);
      }

      ;
    });
  });
});
$('#personal_page #financial_setting .list li').click(function (event) {
  CreateOtherBox(Repeat, RepeatDiv);
});
$('#account #add_account_page_btn').click(function (event) {
  CreateOtherBox(Currency, CurrencyDiv);
});

function CreateOtherBox(name, place) {
  var container = document.querySelector('.other_select_box .other_bar');
  container.innerHTML = "<div></div>";
  var NameList = name;
  $(".other_select_box p").html("".concat(NameList[0]));

  for (var _i6 = 1; _i6 < NameList.length; _i6++) {
    var block = document.createElement('div');
    var NameBox = document.createElement('p');
    block.setAttribute("class", "other_box");
    NameBox.textContent = "".concat(NameList[_i6]);
    container.appendChild(block);
    block.appendChild(NameBox);
  }

  var _loop4 = function _loop4(_i7) {
    $(".other_select_box .other_bar .other_box:nth-child(".concat(_i7, ")")).click(function () {
      var word = $(".other_select_box .other_bar .other_box:nth-child(".concat(_i7, ") p")).text();
      $("".concat(place)).html("".concat(word));
    });
  };

  for (var _i7 = 1; _i7 < NameList.length + 1; _i7++) {
    _loop4(_i7);
  }
}

var _default = {
  transmitCOLOR: transmitCOLOR,
  InitialColor: InitialColor
};
exports.default = _default;
},{"./module.js":"module.js"}],"signup.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var mod = _interopRequireWildcard(require("./module.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

//import process from './dailymoney.js'
$('#change-to-login').click(function () {
  $("#SignUp").css("display", "none");
  $("#Login").css("display", "flex");
});
$('#change-to-signup').click(function () {
  $("#Login").css("display", "none");
  $("#SignUp").css("display", "flex");
}); // navbar change page

var navbar = ['barcode', 'account', 'mainpage', 'accounting', 'project'];
var present_page = 'mainpage';
$('#navbar img:nth-child(1)').click(function () {
  selected_to_unselected();
  present_page = navbar[0];
  unselected_to_selected();
});
$('#navbar img:nth-child(2)').click(function () {
  selected_to_unselected();
  present_page = navbar[1];
  unselected_to_selected();
});
$('#navbar img:nth-child(3)').click(function () {
  selected_to_unselected();
  present_page = navbar[2];
  unselected_to_selected();
  $('#add_deals').css('display', 'none');
});
$('#navbar img:nth-child(4), #main #mainpage #add_deal_btn').click(function () {
  selected_to_unselected();
  present_page = navbar[3];
  unselected_to_selected();
});
$('#navbar img:nth-child(5), #mainpage #project_view .add_project .planned_speed img').click(function () {
  selected_to_unselected();
  present_page = navbar[4];
  unselected_to_selected();
});

function selected_to_unselected() {
  if (present_page == navbar[0]) {
    $('#navbar img:nth-child(1)').attr("src", "./image/navbar/unselect/barcode_unselect.png");
    $('#barcode').css("display", "none");
  } else if (present_page == navbar[1]) {
    $('#navbar img:nth-child(2)').attr("src", "./image/navbar/unselect/account_unselect.png");
    $('#account').css("display", "none");
  } else if (present_page == navbar[2]) {
    $('#navbar img:nth-child(3)').attr("src", "./image/navbar/unselect/mainpage_unselect.png");
    $('#mainpage').css("display", "none");
  } else if (present_page == navbar[3]) {
    $('#navbar img:nth-child(4)').attr("src", "./image/navbar/unselect/accounting_unselect.png");
    $('#accounting').css("display", "none");
  } else {
    $('#navbar img:nth-child(5)').attr("src", "./image/navbar/unselect/project_unselect.png");
    $('#project').css("display", "none");
  }

  ;
}

;

function unselected_to_selected() {
  if (present_page == navbar[0]) {
    $('#navbar img:nth-child(1)').attr("src", "./image/navbar/selected/barcode_select.png");
    $('#barcode').css("display", "flex");
    window.location.href = 'https://luffy.ee.ncku.edu.tw/~stanly/test_camera/docs/index.html?';
  } else if (present_page == navbar[1]) {
    $('#navbar img:nth-child(2)').attr("src", "./image/navbar/selected/account_select.png");
    $('#account').css("display", "flex");
  } else if (present_page == navbar[2]) {
    $('#navbar img:nth-child(3)').attr("src", "./image/navbar/selected/mainpage_select.png");
    $('#mainpage').css("display", "flex");
  } else if (present_page == navbar[3]) {
    $('#navbar img:nth-child(4)').attr("src", "./image/navbar/selected/accounting_select.png");
    $('#accounting').css("display", "flex");
  } else {
    $('#navbar img:nth-child(5)').attr("src", "./image/navbar/selected/project_select.png");
    $('#project').css("display", "flex");
  }

  ;
}

;
var ID = "";
$(document).ready(function () {
  // sign up
  $('#signup button[type="submit"]').click(function (event) {
    event.preventDefault();
    $.get('./signup', {
      name: $('#signup input[name=name]').val(),
      id: $('#signup input[name=id]').val(),
      password: $('#signup input[name=password]').val()
    }, function (data) {
      if ("".concat(data) !== "Signup faild.") {
        localStorage.setItem("ID", data);
        ID = data;
        console.log(data);
        $('#SignUp').css("display", "none");
        $('#main').css("display", "flex");
      } else {
        $("#signup-output").html("".concat(data));
        mod.PopUpMessage(2); //process(ID)
      }

      ;
    });
  }); // login

  $('#login button[type="submit"]').click(function (event) {
    event.preventDefault();
    ID = $('#login input[name=id]').val();
    $.get('./login', {
      id: $('#login input[name=id]').val(),
      password: $('#login input[name=pw]').val()
    }, function (data) {
      if ("".concat(data) !== 'failed,try again') {
        $('#Login').css("display", "none");
        $('#main').css("display", "flex");
        ID = data;
        console.log(data);
        localStorage.setItem("ID", data); //process(ID)
      } else {
        mod.PopUpMessage(5);
      }

      ;
    });
  });
});
$('#popup #background .confirm').click(function () {
  $('#popup').css('display', 'none');
});

function transmit() {
  return ID;
}

;
var _default = transmit;
exports.default = _default;
},{"./module.js":"module.js"}],"graphic.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _signup = _interopRequireDefault(require("./signup.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var x = [];
var y = []; // 2D繪圖

var ctx = document.getElementById('mychart').getContext('2d');
var linechart = new Chart(ctx, {
  type: 'line',
  data: {
    // x軸
    labels: [],
    datasets: [{
      label: 'Money',
      // y軸
      data: [],
      fill: true,
      // 線的顏色
      borderColor: '#FFFFFF',
      // 填滿的顏色
      backgroundColor: '#FFFFFF'
    }]
  }
});

function getGraphData(project_name, personal_or_joint, color) {
  var back_color_r = color.slice(1, 3);
  var back_color_g = color.slice(3, 5);
  var back_color_b = color.slice(5, 7);
  back_color_r = Number.parseInt(back_color_r, 16);
  back_color_g = Number.parseInt(back_color_g, 16);
  back_color_b = Number.parseInt(back_color_b, 16);
  linechart.destroy();
  $.get('./getGraphDetail', {
    id: _signup.default,
    name: project_name
  }, function (data) {
    x = data[0];
    y = data[1];
    linechart = new Chart(ctx, {
      type: 'line',
      data: {
        // x軸
        labels: x,
        datasets: [{
          label: 'Money',
          // y軸
          data: y,
          fill: true,
          // 線的顏色
          borderColor: color,
          // 填滿的顏色
          backgroundColor: "rgba(".concat(back_color_r, ",").concat(back_color_g, ",").concat(back_color_b, ",0.15)")
        }]
      }
    });
  });
}

var _default = {
  getGraphData: getGraphData
};
exports.default = _default;
},{"./signup.js":"signup.js"}],"project.js":[function(require,module,exports) {
"use strict";

var _module = _interopRequireDefault(require("./module.js"));

var _selectormodule = _interopRequireDefault(require("./selectormodule.js"));

var _graphic = _interopRequireDefault(require("./graphic.js"));

var _regeneratorRuntime2 = require("regenerator-runtime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ID = localStorage.getItem("ID");
var PERSONAL_OR_JOINT = false; // personal = false, joint = true

var SHOW_PERSONAL_OR_JOINT = false;
var MEMBER = [ID];
var TIME = new Date();
var port = 6168;
var last_participant = "";
var parti_num = 0; //偵測有沒有圖片

function CheckImgExists(imgurl) {
  return new Promise(function (resolve, reject) {
    var ImgObj = new Image(); //判断图片是否存在

    ImgObj.src = imgurl;

    ImgObj.onload = function (res) {
      resolve(res);
    };

    ImgObj.onerror = function (err) {
      reject(err);
    };
  });
} // type bar (change border-bottom)


var _loop = function _loop(i) {
  $('#project #type_bar p:nth-child(' + "".concat(i) + ')').click(function () {
    $('#project #type_bar p:nth-child(' + "".concat(i) + ')').css("border-bottom", "2px solid #410ADF");
    $('#project #type_bar p:nth-child(' + "".concat(i) + ')').css("color", "#0D0E10");

    if (i === 1) {
      $('#project_list_all').css("display", "none");
      $('#complete_project_all').css("display", "none");
      $('#normal_save_money_list').css("display", "flex"); //$('#normal_save_money_list .normal_save_money').css("display", "flex")
    } else if (i === 2) {
      SHOW_PERSONAL_OR_JOINT = false;
      $('#project_list_all').css("display", "flex");
      $('#complete_project_all').css("display", "none");
      $('#normal_save_money_list').css("display", "none"); //$('#normal_save_money_list .normal_save_money').css("display", "none")
    } else if (i === 3) {
      SHOW_PERSONAL_OR_JOINT = true;
      $('#project_list_all').css("display", "flex");
      $('#complete_project_all').css("display", "none");
      $('#normal_save_money_list').css("display", "none"); //$('#normal_save_money_list .normal_save_money').css("display", "none")
    } else {
      $('#project_list_all').css("display", "none");
      $('#complete_project_all').css("display", "flex");
      $('#normal_save_money_list').css("display", "none"); //$('#project #no_project').css("display", "none")
      //$('#normal_save_money_list .normal_save_money').css("display", "none")
    }

    for (var j = 1; j < 5; j++) {
      if (j !== i) {
        $('#project #type_bar p:nth-child(' + "".concat(j) + ')').css("border-bottom", "none");
        $('#project #type_bar p:nth-child(' + "".concat(j) + ')').css("color", "#BEBEBF");
      }
    }
  });
};

for (var i = 1; i < 5; i++) {
  _loop(i);
} // open/close add_project page


$('#mainpage #project_view .add_project .planned_speed img').click(function () {
  MEMBER = [ID];
  $('#add_project').css("display", "flex");
  setTimeout(function () {
    $('#add_project').css("transform", "translateX(0%)");
  }, 100);
});
$('#project #add_project_btn').click(function () {
  MEMBER = [ID];
  $('#add_project').css("display", "flex");
  setTimeout(function () {
    $('#add_project').css("transform", "translateX(0%)");
  }, 100);
});
$('#add_project .bar img').click(function () {
  $('#add_project').css("transform", "translateX(100%)");
  setTimeout(function () {
    $('#add_project').css("display", "none");
  }, 500);
}); // close personal_project page (project detail page)

$('#show_personal_project .bar img').click(function () {
  $('#show_personal_project').css("transform", "translateX(100%)");
  setTimeout(function () {
    $('#show_personal_project').css("display", "none");
  }, 500);
});
$('#show_joint_project .bar img').click(function () {
  $('#show_joint_project').css("transform", "translateX(100%)");
  setTimeout(function () {
    $('#show_joint_project').css("display", "none");
  }, 500);
}); // open/close normal_save_money page

$('.normal_save_money').click(function () {
  $('#show_normal_save_money').css("display", "flex");
  setTimeout(function () {
    $('#show_normal_save_money').css("transform", "translateX(0%)");
  }, 100);
});
$('#show_normal_save_money .bar img').click(function () {
  $('#show_normal_save_money').css("transform", "translateX(100%)");
  setTimeout(function () {
    $('#show_normal_save_money').css("display", "none");
  }, 500);
}); // open/close add_member

$('#add_project .box:nth-child(5) #add_mem').click(function () {
  $('#add_member').css("display", "flex");
  $('#add_member #id_box input[name=userid]').val('');
  $('#add_member #result').css("display", "none");
  $('#add_member #wrong').css("display", "none");
  setTimeout(function () {
    $('#add_member').css("transform", "translateX(0%)");
  }, 100);
});
$('#add_member .bar img').click(function () {
  $('#add_member').css("transform", "translateX(100%)");
  setTimeout(function () {
    $('#add_member').css("display", "none");
  }, 500);
});

function showProjectDetail(project_name, personal_or_joint) {
  $.get('./getProjectDetail', {
    id: ID,
    name: project_name
  }, /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
      var page_tag, totalmoney, percent, tagposition, date, money;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              page_tag = "#show_".concat(personal_or_joint, "_project");

              if (!(data !== false)) {
                _context.next = 22;
                break;
              }

              $("".concat(page_tag, " .project_detail .title #item")).html("".concat(data[1]));
              _context.next = 5;
              return _module.default.getaprojectmoney(data[0], data[1], data[2], data[9]);

            case 5:
              totalmoney = _context.sent;
              percent = totalmoney / _module.default.StringtoInt(data[9]) * 100;
              percent = Math.round(percent, -1); // draw progress bar

              tagposition = percent / 100 * 245 + 30;
              tagposition = Math.round(tagposition, -1); //console.log(tagposition)

              $("".concat(page_tag, " .SpeedBar .ColorBar")).css("width", "".concat(percent, "%"));
              $("".concat(page_tag, " .money_tag .TagPosition")).css("width", "".concat(tagposition, "px"));
              $("".concat(page_tag, " .money_tag .TagPosition #PriceTag")).html("$ ".concat(totalmoney));
              $("".concat(page_tag, " .SpeedBar .ColorBar")).css("background-color", "".concat(data[2])); // ------------------------------------------------------------------------

              $("".concat(page_tag, " .project_detail #percent")).html("".concat(percent, "%"));
              date = "".concat(data[3], ".").concat(data[4], ".").concat(data[5], " - ").concat(data[6], ".").concat(data[7], ".").concat(data[8]);
              $("".concat(page_tag, " .project_detail .date_box #date")).html(date);
              money = "$".concat(data[9]);
              $("".concat(page_tag, " .project_detail .planned_speed_graph #money")).html(money);
              $("".concat(page_tag, " .project_detail .target_money #money")).html(money);
              _context.next = 22;
              break;

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
}

$('#show_personal_project .planned_speed_graph .SpeedBar, #show_joint_project .planned_speed_graph .SpeedBar').click(function () {
  $('#show_personal_project .money_tag .TagPosition .PriceTag_Div, #show_joint_project .project_detail .money_tag .TagPosition .PriceTag_Div').css("display", "flex");
  setTimeout(function () {
    document.addEventListener("click", clickHiddenPriceTag);
  }, 100);
});

function clickHiddenPriceTag(eve) {
  if (eve.target.class != ".ColorBar") {
    $('#show_personal_project .money_tag .TagPosition .PriceTag_Div, #show_joint_project .project_detail .money_tag .TagPosition .PriceTag_Div').css("display", "none");
  }

  document.removeEventListener("click", clickHiddenPriceTag);
} // show personal/joint project box


$('#navbar img:nth-child(5), #project #type_bar, #mainpage #project_view .add_project .planned_speed img').click(function (event) {
  event.preventDefault();
  getallproject(SHOW_PERSONAL_OR_JOINT);
  getnormalproject();
}); // create getallproject function to draw .project_block in #project

function getallproject(_x2) {
  return _getallproject.apply(this, arguments);
}

function _getallproject() {
  _getallproject = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(TF) {
    var show_no_project, judge, result, container, project_list, color_list, percent_list, i, id, project_name, color, start_year, start_month, start_day, end_year, end_month, end_day, target_number, totalmoney, percent, type, _container, block, infor_1, infor_2, dot, name, date, infor_3, speed, bar, color_bar, btn, _loop3, _i2;

    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            show_no_project = true;
            judge = true;
            result = 0;
            _context2.next = 5;
            return $.get('./getProject', {
              ID: ID
            }, function (data) {
              result = data;
            });

          case 5:
            if (!(result != "nothing")) {
              _context2.next = 84;
              break;
            }

            container = document.querySelector('#main #project #project_list');
            container.innerHTML = "<div></div>";
            project_list = [];
            color_list = [];
            percent_list = [];
            _context2.t0 = _regeneratorRuntime().keys(result);

          case 12:
            if ((_context2.t1 = _context2.t0()).done) {
              _context2.next = 82;
              break;
            }

            i = _context2.t1.value;
            id = _module.default.gettabledata(result, 'id', i);
            project_name = _module.default.gettabledata(result, 'project_name', i);
            color = _module.default.gettabledata(result, 'color', i);
            start_year = _module.default.gettabledata(result, 'start_year', i);
            start_month = _module.default.gettabledata(result, 'start_month', i);
            start_day = _module.default.gettabledata(result, 'start_day', i);
            end_year = _module.default.gettabledata(result, 'end_year', i);
            end_month = _module.default.gettabledata(result, 'end_month', i);
            end_day = _module.default.gettabledata(result, 'end_day', i);
            target_number = _module.default.gettabledata(result, 'target_number', i);
            _context2.next = 26;
            return _module.default.getaprojectmoney(id, project_name, color, target_number);

          case 26:
            totalmoney = _context2.sent;
            console.log('totalmoney', totalmoney);
            percent = totalmoney / _module.default.StringtoInt(_module.default.gettabledata(result, 'target_number', i)) * 100;
            percent = Math.round(percent, -1);
            type = _module.default.gettabledata(result, 'personal_or_joint', i);
            project_list[i] = project_name; // ----------------------------------

            color_list[i] = color;
            percent_list[i] = percent;
            console.log(type); // -----------------------------------

            if (type >= 2) {
              judge = true;
            } else if (type == 1) {
              judge = false;
            } else {
              judge = undefined;
            }

            if (!(judge !== TF)) {
              _context2.next = 38;
              break;
            }

            return _context2.abrupt("continue", 12);

          case 38:
            //create element
            _container = document.querySelector('#main #project #project_list');
            block = document.createElement('div');
            infor_1 = document.createElement('div');
            infor_2 = document.createElement('div');
            dot = document.createElement('img');
            name = document.createElement('p');
            date = document.createElement('p');
            infor_3 = document.createElement('div');
            speed = document.createElement('p');
            bar = document.createElement('div');
            color_bar = document.createElement('div');
            btn = document.createElement('img'); //set text

            name.textContent = "".concat(project_name);
            date.textContent = "".concat(start_year, ".").concat(start_month, ".").concat(start_day, "-").concat(end_year, ".").concat(end_month, ".").concat(end_day);
            speed.textContent = "".concat(percent, "%"); //set attribute

            block.setAttribute('class', 'project_block');
            block.setAttribute('id', "".concat(project_name));
            infor_1.setAttribute('class', 'project_infor');
            infor_2.setAttribute('class', 'type_and_date');
            infor_3.setAttribute('class', 'plannd_speed_infor');
            dot.setAttribute('src', "./image/project/Project_colordot_".concat(_module.default.getColor(color), ".png"));
            dot.setAttribute('height', '35%');
            bar.setAttribute('class', 'SpeedBar');
            color_bar.setAttribute('class', 'ColorBar');
            color_bar.setAttribute('style', "background-color:".concat(color));
            btn.setAttribute('src', './image/btn/btn_arrow_right.png');
            btn.setAttribute('height', '17%');
            btn.setAttribute('id', 'right_btn');
            name.setAttribute('id', 'item');
            speed.setAttribute('id', 'percent'); //append child

            _container.appendChild(block);

            block.appendChild(infor_1);
            block.appendChild(btn);
            bar.appendChild(color_bar);
            infor_1.appendChild(infor_2);
            infor_1.appendChild(infor_3);
            infor_1.appendChild(bar);
            infor_2.appendChild(dot);
            infor_2.appendChild(name);
            infor_2.appendChild(date);
            infor_3.appendChild(speed); // display no_project box or not

            show_no_project = false;
            _context2.next = 12;
            break;

          case 82:
            _loop3 = function _loop3(_i2) {
              $("#".concat(project_list[_i2], " .SpeedBar .ColorBar")).css("width", "".concat(percent_list[_i2], "%"));

              if (SHOW_PERSONAL_OR_JOINT === false) {
                $("#" + "".concat(project_list[_i2])).click(function (e) {
                  $('#show_personal_project').css("display", "flex");
                  setTimeout(function () {
                    $('#show_personal_project').css("transform", "translateX(0%)");
                  }, 100);
                  event.preventDefault(); // I'm not sure is it right or not

                  showProjectDetail(project_list[_i2], 'personal');

                  _graphic.default.getGraphData(project_list[_i2], 1, color_list[_i2]);
                });
              } else {
                $("#" + "".concat(project_list[_i2])).click(function (e) {
                  $('#show_joint_project').css("display", "flex");
                  setTimeout(function () {
                    $('#show_joint_project').css("transform", "translateX(0%)");
                  }, 100);
                  event.preventDefault(); // I'm not sure is it right or not

                  showProjectDetail(project_list[_i2], 'joint');
                  getProjectCreater(project_list[_i2]);
                });
              }
            };

            for (_i2 = 0; _i2 < project_list.length; _i2++) {
              _loop3(_i2);
            }

          case 84:
            if (show_no_project === true) {
              $('#no_project').css("display", "flex");
            } else {
              $('#no_project').css("display", "none");
            }

          case 85:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getallproject.apply(this, arguments);
}

function getnormalproject() {
  return _getnormalproject.apply(this, arguments);
} // ---------------------------------------------------------------------------------
// show complete project box


function _getnormalproject() {
  _getnormalproject = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return $.get('./getnormalproject', {
              id: ID
            }, function (data) {
              $('#percent_sm').html("$".concat(data));
              $('#project_detail_sm #date_box_sm #money').html("$".concat(data));
            });

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getnormalproject.apply(this, arguments);
}

$('#project #type_bar p:nth-child(4)').click(function (event) {
  event.preventDefault();
  getCompleteProject();
});

function getCompleteProject() {
  return _getCompleteProject.apply(this, arguments);
}

function _getCompleteProject() {
  _getCompleteProject = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
    var show_no_complete_project, result, container, complete_list, color_list, j, i, id, project_name, color, start_year, start_month, start_day, end_year, end_month, end_day, type, block, infor_1, infor_2, dot, name, date, infor_3, speed, bar, color_bar, btn, _loop4, _i3;

    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            show_no_complete_project = true;
            result = 0;
            _context4.next = 4;
            return $.get('./getProject', {
              ID: ID
            }, function (data) {
              result = data;
            });

          case 4:
            if (!(result != "nothing")) {
              _context4.next = 75;
              break;
            }

            container = document.querySelector('#main #project #complete_project_list');
            container.innerHTML = "<div></div>";
            complete_list = [];
            color_list = [];
            j = 0;
            _context4.t0 = _regeneratorRuntime().keys(result);

          case 11:
            if ((_context4.t1 = _context4.t0()).done) {
              _context4.next = 73;
              break;
            }

            i = _context4.t1.value;
            id = _module.default.gettabledata(result, 'id', i);
            project_name = _module.default.gettabledata(result, 'project_name', i);
            color = _module.default.gettabledata(result, 'color', i);
            start_year = _module.default.gettabledata(result, 'start_year', i);
            start_month = _module.default.gettabledata(result, 'start_month', i);
            start_day = _module.default.gettabledata(result, 'start_day', i);
            end_year = _module.default.gettabledata(result, 'end_year', i);
            end_month = _module.default.gettabledata(result, 'end_month', i);
            end_day = _module.default.gettabledata(result, 'end_day', i);
            type = _module.default.gettabledata(result, 'personal_or_joint', i);
            console.log('complete', type);

            if (!(type != -1)) {
              _context4.next = 26;
              break;
            }

            return _context4.abrupt("continue", 11);

          case 26:
            console.log('add');
            complete_list[j] = project_name;
            color_list[j] = color;
            j++; //create element

            block = document.createElement('div');
            infor_1 = document.createElement('div');
            infor_2 = document.createElement('div');
            dot = document.createElement('img');
            name = document.createElement('p');
            date = document.createElement('p');
            infor_3 = document.createElement('div');
            speed = document.createElement('p');
            bar = document.createElement('div');
            color_bar = document.createElement('div');
            btn = document.createElement('img'); //set text

            name.textContent = "".concat(project_name);
            date.textContent = "".concat(start_year, ".").concat(start_month, ".").concat(start_day, "-").concat(end_year, ".").concat(end_month, ".").concat(end_day);
            speed.textContent = '100%'; //set attribute

            block.setAttribute('class', 'project_block');
            block.setAttribute('id', "".concat(project_name, "_complete"));
            infor_1.setAttribute('class', 'project_infor');
            infor_2.setAttribute('class', 'type_and_date');
            infor_3.setAttribute('class', 'plannd_speed_infor');
            dot.setAttribute('src', "./image/project/Project_colordot_".concat(_module.default.getColor(color), ".png"));
            dot.setAttribute('height', '35%');
            bar.setAttribute('class', 'SpeedBar');
            color_bar.setAttribute('class', 'ColorBar');
            color_bar.setAttribute('style', "background-color:".concat(color));
            btn.setAttribute('src', './image/btn/btn_arrow_right.png');
            btn.setAttribute('height', '17%');
            btn.setAttribute('id', 'right_btn');
            name.setAttribute('id', 'item');
            speed.setAttribute('id', 'percent'); //append child

            container.appendChild(block);
            block.appendChild(infor_1);
            block.appendChild(btn);
            bar.appendChild(color_bar);
            infor_1.appendChild(infor_2);
            infor_1.appendChild(infor_3);
            infor_1.appendChild(bar);
            infor_2.appendChild(dot);
            infor_2.appendChild(name);
            infor_2.appendChild(date);
            infor_3.appendChild(speed); // display no_project box or not

            show_no_complete_project = false;
            _context4.next = 11;
            break;

          case 73:
            _loop4 = function _loop4(_i3) {
              $("#".concat(complete_list[_i3], "_complete .SpeedBar .ColorBar")).css("width", "100%");
              $("#".concat(complete_list[_i3], "_complete")).click(function (e) {
                $('#show_complete_project').css("display", "flex");
                setTimeout(function () {
                  $('#show_complete_project').css("transform", "translateX(0%)");

                  _module.default.PopUpMessage(1);
                }, 100);
                event.preventDefault(); // I'm not sure is it right or not

                showCompleteProjectDetail(complete_list[_i3]);
              });
            };

            for (_i3 = 0; _i3 < complete_list.length; _i3++) {
              _loop4(_i3);
            }

          case 75:
            if (show_no_complete_project === true) {
              $('#no_complete_project').css("display", "flex");
            } else {
              $('#no_complete_project').css("display", "none");
            }

          case 76:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getCompleteProject.apply(this, arguments);
}

$('#show_complete_project .bar img').click(function () {
  $('#show_complete_project').css("transform", "translateX(100%)");
  setTimeout(function () {
    $('#show_complete_project').css("display", "none");
  }, 500);
});

function showCompleteProjectDetail(project_name) {
  $.get('./getProjectDetail', {
    id: ID,
    name: project_name
  }, function (data) {
    if (data !== false) {
      console.log(data[1]);
      $('#show_complete_project #complete_project_form .box:nth-child(1) p:nth-child(2)').html(data[1]);
      $('#show_complete_project #complete_project_form .box:nth-child(2) img').attr("src", "./image/project/Project_colordot_".concat(_module.default.getColor(data[2]), ".png"));
      var date = "".concat(data[3], ".").concat(data[4], ".").concat(data[5], " - ").concat(data[6], ".").concat(data[7], ".").concat(data[8]);
      $('#show_complete_project #complete_project_form .box:nth-child(3) p:nth-child(2)').html(date);
      $('#show_complete_project #complete_project_form .box:nth-child(4) p:nth-child(2)').html(data[9]);
      var type = '個人專案';

      if (data[10] != 1) {
        type = '共同專案';
      }

      $('#show_complete_project #complete_project_form .box:nth-child(5) p:nth-child(2)').html(type);

      if (data[11] === '') {
        data[11] = '（無）';
      }

      $('#show_complete_project #complete_project_form .box:nth-child(8) p:nth-child(2)').html(data[11]);
    }
  });
} // ---------------------------------------------------------------------------------


function getProjectMember(creater, user, project_name) {
  $.get('./getMember', {
    ID: creater,
    project_name: project_name
  }, function (data) {
    if (data != "nothing") {
      var container = document.querySelector('#main #show_joint_project .ranking_list');
      container.innerHTML = "<div></div>";
      var member_list = [];
      var percent_list = [];
      var count_member = 0;
      var have_pic = 0;

      for (var i in data) {
        var member_1 = _module.default.gettabledata(data, 'member', i);

        count_member++;
        member_list[i] = member_1;
      }

      for (var i in data) {
        var target_money = _module.default.gettabledata(data, 'target_number', i) / count_member;
        var percent = _module.default.gettabledata(data, 'saved_money', i) / target_money * 100;
        percent = Math.round(percent, -1);
        percent_list[i] = percent;
        var block = document.createElement('div');
        var box1 = document.createElement('div');
        var member_pic = document.createElement('img'); // draw member price tag

        var box2 = document.createElement('div');
        var already_save = document.createElement('p');
        var box3 = document.createElement('div');
        var box4 = document.createElement('div');
        var member_money = document.createElement('p'); // -----------------------------------------------------

        var progress_bar_bottom = document.createElement('div');
        var progress_bar = document.createElement('div'); //set text

        already_save.textContent = "$".concat(target_money);
        member_money.textContent = "$ ".concat(_module.default.gettabledata(data, 'saved_money', i)); //set attribute

        block.setAttribute('class', 'member_block');
        block.setAttribute('id', "".concat(member_list[i], "block"));
        box1.setAttribute('class', 'member_box');
        box2.setAttribute('class', 'tag_and_money');
        box3.setAttribute('class', 'tag_position');
        box4.setAttribute('class', 'tag');
        member_pic.setAttribute('id', "".concat(member_list[i]));
        member_pic.setAttribute('src', "./image/personal_pic/2.jpg");
        member_pic.setAttribute('width', '11.5%');
        member_pic.setAttribute('height', '80%');
        progress_bar_bottom.setAttribute('class', 'progress_bar_bg');
        progress_bar.setAttribute('class', 'progress_bar'); //append child

        container.appendChild(block);
        block.appendChild(member_pic);
        block.appendChild(box1);
        box1.appendChild(box2);
        box1.appendChild(progress_bar_bottom);
        box2.appendChild(box3);
        box2.appendChild(already_save);
        box3.appendChild(box4);
        box4.appendChild(member_money);
        progress_bar_bottom.appendChild(progress_bar);
      }

      var _loop2 = function _loop2(_i) {
        tagposition = percent_list[_i] / 100 * 243 + 25;
        tagposition = Math.round(tagposition, -1);
        console.log(tagposition);
        $("#".concat(member_list[_i], "block .member_box .tag_position")).css("width", "".concat(tagposition, "px"));
        $("#".concat(member_list[_i], "block .progress_bar_bg .progress_bar")).css("width", "".concat(percent_list[_i], "%"));

        if (member_list[_i] === user) {
          $("#".concat(member_list[_i], "block .progress_bar_bg .progress_bar")).css("background-color", '#8E5FF4');
        } else {
          $("#".concat(member_list[_i], "block .progress_bar_bg .progress_bar")).css("background-color", '#E4CCFF');
        }

        $("#show_joint_project #".concat(member_list[_i], "block .progress_bar_bg")).click(function () {
          $("#show_joint_project #".concat(member_list[_i], "block .member_box .tag_position .tag")).css("display", "flex");
          setTimeout(function () {
            document.addEventListener("click", clickHiddenTag);
          }, 100);
        });

        function clickHiddenTag(eve) {
          if (eve.target.id != "#".concat(member_list[_i], "block")) {
            $("#show_joint_project #".concat(member_list[_i], "block .member_box .tag_position .tag")).css("display", "none");
          }

          document.removeEventListener("click", clickHiddenTag);
        }
      };

      for (var _i = 0; _i < member_list.length; _i++) {
        var tagposition;

        _loop2(_i);
      }

      if (count_member === 1) {
        have_pic = 0;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".jpg").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".jpg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".png").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".png"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".jpeg").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".jpeg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".mp4").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".mp4"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".MOV").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".MOV"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        }); //-------------------------
      }

      if (count_member === 2) {
        have_pic = 0;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".jpg").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".jpg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".png").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".png"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".jpeg").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".jpeg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".mp4").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".mp4"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".MOV").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".MOV"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        }); //-------------------------

        have_pic = 0;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".jpg").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".jpg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".png").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".png"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".jpeg").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".jpeg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".mp4").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".mp4"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".MOV").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".MOV"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        }); //-------------------------
      }

      if (count_member === 3) {
        have_pic = 0;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".jpg").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".jpg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".png").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".png"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".jpeg").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".jpeg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".mp4").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".mp4"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".MOV").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".MOV"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        }); //-------------------------

        have_pic = 0;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".jpg").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".jpg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".png").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".png"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".jpeg").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".jpeg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".mp4").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".mp4"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".MOV").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".MOV"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        }); //-------------------------

        have_pic = 0;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[2] + ".jpg").then(function () {
          $("#" + member_list[2]).attr('src', "./image/personal_pic/".concat(member_list[2], ".jpg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[2]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[2] + ".png").then(function () {
          $("#" + member_list[2]).attr('src', "./image/personal_pic/".concat(member_list[2], ".png"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[2]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[2] + ".jpeg").then(function () {
          $("#" + member_list[2]).attr('src', "./image/personal_pic/".concat(member_list[2], ".jpeg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[2]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[2] + ".mp4").then(function () {
          $("#" + member_list[2]).attr('src', "./image/personal_pic/".concat(member_list[2], ".mp4"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[2]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[2] + ".MOV").then(function () {
          $("#" + member_list[2]).attr('src', "./image/personal_pic/".concat(member_list[2], ".MOV"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[2]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
      }

      if (count_member === 4) {
        have_pic = 1;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".jpg").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".jpg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".png").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".png"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".jpeg").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".jpeg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".mp4").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".mp4"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".MOV").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".MOV"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        }); //-------------------------

        have_pic = 0;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".jpg").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".jpg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".png").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".png"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".jpeg").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".jpeg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".mp4").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".mp4"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".MOV").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".MOV"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        }); //-------------------------

        have_pic = 0;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[2] + ".jpg").then(function () {
          $("#" + member_list[2]).attr('src', "./image/personal_pic/".concat(member_list[2], ".jpg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[2]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[2] + ".png").then(function () {
          $("#" + member_list[2]).attr('src', "./image/personal_pic/".concat(member_list[2], ".png"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[2]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[2] + ".jpeg").then(function () {
          $("#" + member_list[2]).attr('src', "./image/personal_pic/".concat(member_list[2], ".jpeg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[2]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[2] + ".mp4").then(function () {
          $("#" + member_list[2]).attr('src', "./image/personal_pic/".concat(member_list[2], ".mp4"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[2]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[2] + ".MOV").then(function () {
          $("#" + member_list[2]).attr('src', "./image/personal_pic/".concat(member_list[2], ".MOV"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[2]).attr('src', "./image/personal_pic/2.jpg");
          }
        }); //---------------

        have_pic = 0;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[3] + ".jpg").then(function () {
          $("#" + member_list[3]).attr('src', "./image/personal_pic/".concat(member_list[3], ".jpg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[3]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[3] + ".png").then(function () {
          $("#" + member_list[3]).attr('src', "./image/personal_pic/".concat(member_list[3], ".png"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[3]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[3] + ".jpeg").then(function () {
          $("#" + member_list[3]).attr('src', "./image/personal_pic/".concat(member_list[3], ".jpeg"));
          have_pic = 1;
          console.log("i==" + (i - 1));
          console.log("member_list[i]==" + member_list[i - 1]);
          console.log(1);
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[3]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[3] + ".mp4").then(function () {
          $("#" + member_list[3]).attr('src', "./image/personal_pic/".concat(member_list[3], ".mp4"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[3]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[3] + ".MOV").then(function () {
          $("#" + member_list[3]).attr('src', "./image/personal_pic/".concat(member_list[3], ".MOV"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[3]).attr('src', "./image/personal_pic/2.jpg");
          }
        }); //-------------------------
      }

      if (count_member === 5) {
        have_pic = 0;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".jpg").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".jpg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".png").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".png"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".jpeg").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".jpeg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".mp4").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".mp4"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[0] + ".MOV").then(function () {
          $("#" + member_list[0]).attr('src', "./image/personal_pic/".concat(member_list[0], ".MOV"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[0]).attr('src', "./image/personal_pic/2.jpg");
          }
        }); //-------------------------

        have_pic = 0;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".jpg").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".jpg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".png").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".png"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".jpeg").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".jpeg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".mp4").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".mp4"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[1] + ".MOV").then(function () {
          $("#" + member_list[1]).attr('src', "./image/personal_pic/".concat(member_list[1], ".MOV"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[1]).attr('src', "./image/personal_pic/2.jpg");
          }
        }); //-------------------------

        have_pic = 0;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[2] + ".jpg").then(function () {
          $("#" + member_list[2]).attr('src', "./image/personal_pic/".concat(member_list[2], ".jpg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[2]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[2] + ".png").then(function () {
          $("#" + member_list[2]).attr('src', "./image/personal_pic/".concat(member_list[2], ".png"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[2]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[2] + ".jpeg").then(function () {
          $("#" + member_list[2]).attr('src', "./image/personal_pic/".concat(member_list[2], ".jpeg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[2]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[2] + ".mp4").then(function () {
          $("#" + member_list[2]).attr('src', "./image/personal_pic/".concat(member_list[2], ".mp4"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[2]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[2] + ".MOV").then(function () {
          $("#" + member_list[2]).attr('src', "./image/personal_pic/".concat(member_list[2], ".MOV"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[2]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        have_pic = 0;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[3] + ".jpg").then(function () {
          $("#" + member_list[3]).attr('src', "./image/personal_pic/".concat(member_list[3], ".jpg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[3]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[3] + ".png").then(function () {
          $("#" + member_list[3]).attr('src', "./image/personal_pic/".concat(member_list[3], ".png"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[3]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[3] + ".jpeg").then(function () {
          $("#" + member_list[3]).attr('src', "./image/personal_pic/".concat(member_list[3], ".jpeg"));
          have_pic = 1;
          console.log("i==" + (i - 1));
          console.log("member_list[i]==" + member_list[i - 1]);
          console.log(1);
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[3]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[3] + ".mp4").then(function () {
          $("#" + member_list[3]).attr('src', "./image/personal_pic/".concat(member_list[3], ".mp4"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[3]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[3] + ".MOV").then(function () {
          $("#" + member_list[3]).attr('src', "./image/personal_pic/".concat(member_list[3], ".MOV"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[3]).attr('src', "./image/personal_pic/2.jpg");
          }
        }); //-------------------------
        //-------------------------

        have_pic = 0;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[4] + ".jpg").then(function () {
          $("#" + member_list[4]).attr('src', "./image/personal_pic/".concat(member_list[4], ".jpg"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[4]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[4] + ".png").then(function () {
          $("#" + member_list[4]).attr('src', "./image/personal_pic/".concat(member_list[4], ".png"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[4]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[4] + ".jpeg").then(function () {
          $("#" + member_list[4]).attr('src', "./image/personal_pic/".concat(member_list[4], ".jpeg"));
          have_pic = 1;
          console.log("i==" + (i - 1));
          console.log("member_list[i]==" + member_list[i - 1]);
          console.log(1);
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[4]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[4] + ".mp4").then(function () {
          $("#" + member_list[4]).attr('src', "./image/personal_pic/".concat(member_list[4], ".mp4"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[4]).attr('src', "./image/personal_pic/2.jpg");
          }
        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + member_list[4] + ".MOV").then(function () {
          $("#" + member_list[4]).attr('src', "./image/personal_pic/".concat(member_list[4], ".MOV"));
          have_pic = 1;
        }).catch(function () {
          if (have_pic === 0) {
            $("#" + member_list[4]).attr('src', "./image/personal_pic/2.jpg");
          }
        }); //-------------------------              
      }
    }
  });
} // rank dynamic add


function getProjectCreater(project_name) {
  $.get('./getCreater', {
    ID: ID,
    project_name: project_name
  }, function (data) {
    if (data != "nothing") {
      var project_name = _module.default.gettabledata(data, 'project_name', 0);

      var creater = _module.default.gettabledata(data, 'id', 0);

      var user = _module.default.gettabledata(data, 'member', 0);

      getProjectMember(creater, user, project_name);
    } else {
      console.log('wrong');
    }
  });
}

$(document).ready(function () {
  // add project
  $('#project_form button[type="submit"]').click(function (event) {
    event.preventDefault();
    PERSONAL_OR_JOINT = MEMBER.length;
    $.get('./project', {
      id: ID,
      project_name: $('#project_form input[name=project_name]').val(),
      //color: COLOR,
      color: _selectormodule.default.transmitCOLOR,
      start_date: $('#project_form input[name=start_date]').val(),
      end_date: $('#project_form input[name=end_date]').val(),
      target_number: $('#project_form input[name=target_number]').val(),
      member: MEMBER,
      distribute: '均分',
      note: $('#project_form textarea[name=note]').val(),
      personal_or_joint: PERSONAL_OR_JOINT
    }, function (data) {
      if (data === '0') {
        $('#project_form input[name=project_name]').val('');
        $('#add_project .box:nth-child(2) .color_selector img:nth-child(1)').attr("src", "./image/project/Project_colordot_orange.png"); //COLOR = '#F6A93B'

        _selectormodule.default.InitialColor();

        $('#project_form input[name=start_date]').val('');
        $('#project_form input[name=end_day]').val('');
        $('#project_form input[name=target_number]').val('');
        MEMBER = [ID]; // 還沒加入均分

        $('#project_form textarea[name=note]').val('');
        $("#add_project_-output").html("".concat(data));

        _module.default.PopUpMessage(4);
      } else {
        _module.default.PopUpMessage(2);
      }
    });
  }); // clean the input value in the add_project page

  $('#project #add_project_btn, #mainpage #project_view .add_project .planned_speed img').click(function (event) {
    $('#project_form input[name=project_name]').val(''), $('#add_project .box:nth-child(2) .color_selector img:nth-child(1)').attr("src", "./image/project/Project_colordot_orange.png"); //COLOR = '#F6A93B'

    _selectormodule.default.InitialColor();

    $('#project_form input[name=start_date]').val('');
    $('#project_form input[name=end_date]').val('');
    $('#project_form input[name=target_number]').val(''); // 還沒加入均分

    $('#project_form textarea[name=note]').val('');
  }); // search member username

  $('#add_member #id_box img').click(function (event) {
    event.preventDefault();
    $.get('./username', {
      id: $('#add_member #id_box input[name=userid]').val()
    }, function (data) {
      if (data !== "failed,try again") {
        var l_id = $('#add_member #id_box input[name=userid]').val();
        $('#add_member #result').css("display", "flex");
        $('#add_member #result p').html("".concat(data));
        $('#add_member #wrong').css("display", "none");
        var have_pic = 0;
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + l_id + ".jpg" //imgurl here
        ).then(function () {
          $("#add_member #result img:nth-child(1)").attr("src", "./image/personal_pic/" + l_id + ".jpg");
          have_pic = 1; //success callback
        }).catch(function () {
          // console.log(2)
          if (have_pic === 0) {
            $("#add_member #result img:nth-child(1)").attr("src", "./image/personal_pic/2.jpg");
          } //fail callback

        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + l_id + ".png" //imgurl here
        ).then(function () {
          $("#add_member #result img:nth-child(1)").attr("src", "./image/personal_pic/" + l_id + ".png");
          have_pic = 1; //success callback
        }).catch(function () {
          if (have_pic === 0) {
            $("#add_member #result img:nth-child(1)").attr("src", "./image/personal_pic/2.jpg");
          } //fail callback

        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + l_id + ".jpeg" //imgurl here
        ).then(function () {
          $("#add_member #result img:nth-child(1)").attr("src", "./image/personal_pic/" + l_id + ".jpeg");
          have_pic = 1; //success callback
        }).catch(function () {
          if (have_pic === 0) {
            $("#add_member #result img:nth-child(1)").attr("src", "./image/personal_pic/2.jpg");
          } //fail callback

        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + l_id + ".MOV" //imgurl here
        ).then(function () {
          $("#add_member #result img:nth-child(1)").attr("src", "./image/personal_pic/" + l_id + ".MOV");
          have_pic = 1; //success callback
        }).catch(function () {
          if (have_pic === 0) {
            $("#add_member #result img:nth-child(1)").attr("src", "./image/personal_pic/2.jpg");
          } //fail callback

        });
        CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + l_id + ".mp4" //imgurl here
        ).then(function () {
          $("#add_member #result img:nth-child(1)").attr("src", "./image/personal_pic/" + l_id + ".mp4");
          have_pic = 1; //success callback
        }).catch(function () {
          if (have_pic === 0) {
            $("#add_member #result img:nth-child(1)").attr("src", "./image/personal_pic/2.jpg");
          } //fail callback

        }); //---------------------------------
      } else {
        $('#add_member #result').css("display", "none");
        $('#add_member #wrong').css("display", "flex");
      }
    });
  }); // add member in project

  $('#add_member #result #add_mem_btn').click(function (event) {
    MEMBER.push($('#add_member #id_box input[name=userid]').val());
    last_participant = $('#add_member #id_box input[name=userid]').val();
    console.log(MEMBER);
    console.log("last_participant = " + last_participant);

    if (parti_num === 0) {
      showParticipationImage();
      setStickerSrc();
    } else {
      setStickerSrc();
    }
  });
});
$(function () {
  $(".calendar").datepicker();
});
var last_participant = ""; //show participant image

function showParticipationImage() {
  var container = document.querySelector('#add_project #project_form .box:nth-child(5) .participate_member');
  container.innerHTML = "<div></div>"; //create element

  var sticker1 = document.createElement('img');
  var sticker2 = document.createElement('img');
  var sticker3 = document.createElement('img');
  var sticker4 = document.createElement('img');
  var block = document.createElement('div'); //set attribute

  block.setAttribute('class', 'sticker_block');
  block.setAttribute('id', "memberimage");
  sticker1.setAttribute('height', '34px');
  sticker1.setAttribute('width', '34px');
  sticker2.setAttribute('height', '34px');
  sticker2.setAttribute('width', '34px');
  sticker3.setAttribute('height', '34px');
  sticker3.setAttribute('width', '34px');
  sticker4.setAttribute('height', '34px');
  sticker4.setAttribute('width', '34px'); //append child

  container.appendChild(block);
  block.appendChild(sticker1);
  block.appendChild(sticker2);
  block.appendChild(sticker3);
  block.appendChild(sticker4);
}

function setStickerSrc() {
  var have_pic = 0;
  parti_num++;
  CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + last_participant + ".jpg" //imgurl here
  ).then(function () {
    if (parti_num === 1) {
      $("#memberimage img:nth-child(1)").attr("src", "./image/personal_pic/" + last_participant + ".jpg");
    } else if (parti_num === 2) {
      $("#memberimage img:nth-child(2)").attr("src", "./image/personal_pic/" + last_participant + ".jpg");
    } else if (parti_num === 3) {
      $("#memberimage img:nth-child(3)").attr("src", "./image/personal_pic/" + last_participant + ".jpg");
    } else if (parti_num === 4) {
      $("#memberimage img:nth-child(4)").attr("src", "./image/personal_pic/" + last_participant + ".jpg");
    }

    have_pic = 1; //success callback
  }).catch(function () {
    if (have_pic === 0) {
      if (parti_num === 1) {
        $("#memberimage img:nth-child(1)").attr("src", "./image/personal_pic/2.jpg");
      } else if (parti_num === 2) {
        $("#memberimage img:nth-child(2)").attr("src", "./image/personal_pic/2.jpg");
      } else if (parti_num === 3) {
        $("#memberimage img:nth-child(3)").attr("src", "./image/personal_pic/2.jpg");
      } else if (parti_num === 4) {
        $("#memberimage img:nth-child(4)").attr("src", "./image/personal_pic/2.jpg");
      }
    } //fail callback

  });
  CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + last_participant + ".png" //imgurl here
  ).then(function () {
    if (parti_num === 1) {
      $("#memberimage img:nth-child(1)").attr("src", "./image/personal_pic/" + last_participant + ".png");
    } else if (parti_num === 2) {
      $("#memberimage img:nth-child(2)").attr("src", "./image/personal_pic/" + last_participant + ".png");
    } else if (parti_num === 3) {
      $("#memberimage img:nth-child(3)").attr("src", "./image/personal_pic/" + last_participant + ".png");
    } else if (parti_num === 4) {
      $("#memberimage img:nth-child(4)").attr("src", "./image/personal_pic/" + last_participant + ".png");
    }

    have_pic = 1; //success callback
  }).catch(function () {
    if (have_pic === 0) {
      if (parti_num === 1) {
        $("#memberimage img:nth-child(1)").attr("src", "./image/personal_pic/2.jpg");
      } else if (parti_num === 2) {
        $("#memberimage img:nth-child(2)").attr("src", "./image/personal_pic/2.jpg");
      } else if (parti_num === 3) {
        $("#memberimage img:nth-child(3)").attr("src", "./image/personal_pic/2.jpg");
      } else if (parti_num === 4) {
        $("#memberimage img:nth-child(4)").attr("src", "./image/personal_pic/2.jpg");
      }
    } //fail callback

  });
  CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + last_participant + ".jpeg" //imgurl here
  ).then(function () {
    if (parti_num === 1) {
      $("#memberimage img:nth-child(1)").attr("src", "./image/personal_pic/" + last_participant + ".jpeg");
    } else if (parti_num === 2) {
      $("#memberimage img:nth-child(2)").attr("src", "./image/personal_pic/" + last_participant + ".jpeg");
    } else if (parti_num === 3) {
      $("#memberimage img:nth-child(3)").attr("src", "./image/personal_pic/" + last_participant + ".jpeg");
    } else if (parti_num === 4) {
      $("#memberimage img:nth-child(4)").attr("src", "./image/personal_pic/" + last_participant + ".jpeg");
    }

    have_pic = 1; //success callback
  }).catch(function () {
    if (have_pic === 0) {
      if (parti_num === 1) {
        $("#memberimage img:nth-child(1)").attr("src", "./image/personal_pic/2.jpg");
      } else if (parti_num === 2) {
        $("#memberimage img:nth-child(2)").attr("src", "./image/personal_pic/2.jpg");
      } else if (parti_num === 3) {
        $("#memberimage img:nth-child(3)").attr("src", "./image/personal_pic/2.jpg");
      } else if (parti_num === 4) {
        $("#memberimage img:nth-child(4)").attr("src", "./image/personal_pic/2.jpg");
      }
    } //fail callback

  });
  CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + last_participant + ".MOV" //imgurl here
  ).then(function () {
    if (parti_num === 1) {
      $("#memberimage img:nth-child(1)").attr("src", "./image/personal_pic/" + last_participant + ".MOV");
    } else if (parti_num === 2) {
      $("#memberimage img:nth-child(2)").attr("src", "./image/personal_pic/" + last_participant + ".MOV");
    } else if (parti_num === 3) {
      $("#memberimage img:nth-child(3)").attr("src", "./image/personal_pic/" + last_participant + ".MOV");
    } else if (parti_num === 4) {
      $("#memberimage img:nth-child(4)").attr("src", "./image/personal_pic/" + last_participant + ".MOV");
    }

    have_pic = 1; //success callback
  }).catch(function () {
    if (have_pic === 0) {
      if (parti_num === 1) {
        $("#memberimage img:nth-child(1)").attr("src", "./image/personal_pic/2.jpg");
      } else if (parti_num === 2) {
        $("#memberimage img:nth-child(2)").attr("src", "./image/personal_pic/2.jpg");
      } else if (parti_num === 3) {
        $("#memberimage img:nth-child(3)").attr("src", "./image/personal_pic/2.jpg");
      } else if (parti_num === 4) {
        $("#memberimage img:nth-child(4)").attr("src", "./image/personal_pic/2.jpg");
      }
    } //fail callback

  });
  CheckImgExists("http://luffy.ee.ncku.edu.tw:" + port + "/image/personal_pic/" + last_participant + ".mp4" //imgurl here
  ).then(function () {
    if (parti_num === 1) {
      sticker1.setAttribute("src", "./image/personal_pic/" + last_participant + ".mp4");
    } else if (parti_num === 2) {
      sticker2.setAttribute("src", "./image/personal_pic/" + last_participant + ".mp4");
    } else if (parti_num === 3) {
      sticker3.setAttribute("src", "./image/personal_pic/" + last_participant + ".mp4");
    } else if (parti_num === 4) {
      sticker4.setAttribute("src", "./image/personal_pic/" + last_participant + ".mp4");
    }

    have_pic = 1; //success callback
  }).catch(function () {
    if (have_pic === 0) {
      if (parti_num === 1) {
        sticker1.setAttribute("src", "./image/personal_pic/2.jpg");
      } else if (parti_num === 2) {
        sticker2.setAttribute("src", "./image/personal_pic/2.jpg");
      } else if (parti_num === 3) {
        sticker3.setAttribute("src", "./image/personal_pic/2.jpg");
      } else if (parti_num === 4) {
        sticker4.setAttribute("src", "./image/personal_pic/2.jpg");
      }
    }

    console.log("last_participant = " + last_participant);
    console.log("parti_num=" + parti_num); //fail callback
  }); //
}
},{"./module.js":"module.js","./selectormodule.js":"selectormodule.js","./graphic.js":"graphic.js","regenerator-runtime":"../node_modules/regenerator-runtime/runtime.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "33016" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","project.js"], null)
//# sourceMappingURL=project.b5dfbff8.js.map