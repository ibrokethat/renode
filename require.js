/*
@name:          require.js

@description:   module loader

                js module loader
                web worker spawning

@author:        Simon Jefford

*/

function log() {
  console.log.apply(console, arguments);
}

(function() {

  "use strict";

  var loading = {};
  var uninitialised = {};
  var modules = {};
  var load;
  var head;


  function getView (url, success) {

    // create request
    var xhr = new XMLHttpRequest(), header, defaultHeaders;

    // set headers
    defaultHeaders = {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'text/javascript, text/html, application/xml, text/xml, application/json, application/javascript'
    };

    xhr.open("GET", url, true);

    for(header in defaultHeaders) {
      xhr.setRequestHeader(header, defaultHeaders[header]);
    }

    // add handler
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4) {
        if (/(200|201|204|304)/.test(xhr.status)) {
          success(xhr.responseText);
        }
        else {
          throw new Error(url + "failed to load");
        }
      }
    };

    // send request
    xhr.send(null);

  }

  // require a module
  function require (moduleName, from) {
    try {

      moduleName = resolvePath(from || null, moduleName);
      return modules[moduleName].def;

    }
    catch(e) {

      console.warn("module not found > ", moduleName);

    }

  }

  //  register a module
  function register (moduleName, def, module) {
    module = module || {};
    module.id = module.id || moduleName;

    modules[moduleName] = {
      module: module,
      def: def
    };
  }

  if(typeof importScripts === "function") {

    load = function (moduleName) {

      if(modules[moduleName]) {
        return require(moduleName);
      }
      // if(!self.debug) {
      //   moduleName += ".min";
      // }
      importScripts(moduleName + ".js");

    };
  }
  else {

    head = document.getElementsByTagName("head")[0];
    // load a module from the server
    load = function (moduleName) {

      if(modules.hasOwnProperty(moduleName)) {

        return require(moduleName);

      }
      else {

        loading[moduleName] = true;
        var script = document.createElement("script");
        script.id = moduleName;
        script.src = moduleName + ".js";
        head.appendChild(script);

      }

    };

  }

  // load a template from the server
  function loadView(fileName) {

    loading[fileName] = true;
    getView(fileName , defineView.bind(null, fileName));

  }


  /*
    @description extracts the required modules from the html
    @param       {File} file
    @return      {File} file
  */
  function extractViewRequires (file) {

    var controllers = (file.match(/data-controller="(\w+)"/g) || []).map(function (controller) {
      return "../controllers/" + (/data-controller="(\w+)"/.exec(controller)[1]);
    });

    var views = (file.match(/data-view="(\w+)"/g) || []).map(function (view) {
      return "./" + (/data-view="(\w+)"/.exec(view)[1]) + ".html";
    });

    return controllers.concat(views);

  }


  // initialise a module
  function initModule (moduleName, def) {

    var exports = {};
    var module = {path: moduleName};

    def(function(dependencyName, root)  {
      return require(dependencyName, root || moduleName);
    }, exports, module);

    exports = module.exports || exports;

    register(moduleName, exports, module);

    return exports;

  }


  function define(moduleName, dependencies, def) {

    delete loading[moduleName];
    uninitialised[moduleName] = true;

    if (typeof def === "undefined") {
      def = dependencies;
      dependencies = [];
    }

    // test to see if all the modules dependencies are loaded
    var dependencies = dependencies.filter(function(dependencyName) {

      dependencyName = resolvePath(moduleName, dependencyName);

      if(!modules[dependencyName]) {

        em.once("module/initialised/" + dependencyName, function() {
          define(moduleName, dependencies, def);
        });

        if (loading[dependencyName] || uninitialised[dependencyName]) {
          return true;
        }
        else {

          if(/\.html$/.test(dependencyName)) {
            loadView(dependencyName, moduleName);
          }
          else {
            load(dependencyName, moduleName);
          }
          return true;
        }
      }
      return false;
    });


    //  if there are no unloaded dependencies initialise the module
    if(dependencies.length === 0 && !modules[moduleName]) {

      delete uninitialised[moduleName];

      initModule(moduleName, def);
      em.emit("module/initialised/" + moduleName);
      log("module/initialised/", moduleName)

    }

  }


  function defineView (fileName, data) {

    delete loading[fileName];
    uninitialised[fileName] = true;

    var dependencies = extractViewRequires(data);

    // test to see if all the modules dependencies are loaded
    dependencies = dependencies.filter(function(dependencyName) {

      dependencyName = resolvePath(fileName, dependencyName);

      if(!modules[dependencyName]) {

        em.once("module/initialised/" + dependencyName, function() {
          defineView(fileName, data);
        });

        if (loading[dependencyName] || uninitialised[dependencyName]) {
          return true;
        }
        else {

          if(/\.html$/.test(dependencyName)) {
            loadView(dependencyName);
          }
          else {
            load(dependencyName);
          }
          return true;
        }
      }
      return false;
    });

    //  if there are no unloaded dependencies initialise the module
    if(dependencies.length === 0 && !modules[fileName]) {

      register(fileName, data);
      delete uninitialised[fileName];

      em.emit("module/initialised/" + fileName);
      log("module/initialised/", fileName)


    }

  }


  //  todo: refactor for genuine package loading
  function resolvePath (from, to) {

    if (to === "./TrackModule") {
      console.log(from, " > ", to);
    }

    if (/^\w+/.test(to)) {

      return "node_modules/" + to + "/" + to;

    }
    else {

      var cwd = process.cwd();

      process.chdir(from ? path.dirname(from) : cwd);

      var name = path.resolve(to);

      process.chdir(cwd);

      return name.substring(1);

    }

  }


  // register system api's and language extensions
  var process = initModule("node_modules/process/process", function(require, exports, module) {

    var process = module.exports = {};

    process.nextTick = (function () {
        var canSetImmediate = typeof window !== 'undefined'
            && window.setImmediate;
        var canPost = typeof window !== 'undefined'
            && window.postMessage && window.addEventListener
        ;

        if (canSetImmediate) {
            return function (f) { return window.setImmediate(f) };
        }

        if (canPost) {
            var queue = [];
            window.addEventListener('message', function (ev) {
                if (ev.source === window && ev.data === 'browserify-tick') {
                    ev.stopPropagation();
                    if (queue.length > 0) {
                        var fn = queue.shift();
                        fn();
                    }
                }
            }, true);

            return function nextTick(fn) {
                queue.push(fn);
                window.postMessage('browserify-tick', '*');
            };
        }

        return function nextTick(fn) {
            setTimeout(fn, 0);
        };
    })();

    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];

    process.binding = function (name) {
        if (name === 'evals') return (require)('vm')
        else throw new Error('No such module. (Possibly not yet loaded)')
    };

    (function () {
        var cwd = '/';
        var path;
        process.cwd = function () { return cwd };
        process.chdir = function (dir) {
            if (!path) path = require('path');
            cwd = path.resolve(cwd, dir);
        };
    })();

  });


  var events = initModule("node_modules/events/events", function(require, exports) {

    if (!process.EventEmitter) process.EventEmitter = function () {};

    var EventEmitter = exports.EventEmitter = process.EventEmitter;
    var isArray = typeof Array.isArray === 'function'
        ? Array.isArray
        : function (xs) {
            return Object.prototype.toString.call(xs) === '[object Array]'
        }
    ;
    function indexOf (xs, x) {
        if (xs.indexOf) return xs.indexOf(x);
        for (var i = 0; i < xs.length; i++) {
            if (x === xs[i]) return i;
        }
        return -1;
    }

    // By default EventEmitters will print a warning if more than
    // 10 listeners are added to it. This is a useful default which
    // helps finding memory leaks.
    //
    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    var defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function(n) {
      if (!this._events) this._events = {};
      this._events.maxListeners = n;
    };


    EventEmitter.prototype.emit = function(type) {

      // If there is no 'error' event listener then throw.
      if (type === 'error') {
        if (!this._events || !this._events.error ||
            (isArray(this._events.error) && !this._events.error.length))
        {
          if (arguments[1] instanceof Error) {
            throw arguments[1]; // Unhandled 'error' event
          } else {
            throw new Error("Uncaught, unspecified 'error' event.");
          }
          return false;
        }
      }

      if (!this._events) return false;
      var handler = this._events[type];
      if (!handler) return false;

      if (typeof handler == 'function') {
        switch (arguments.length) {
          // fast cases
          case 1:
            handler.call(this);
            break;
          case 2:
            handler.call(this, arguments[1]);
            break;
          case 3:
            handler.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            var args = Array.prototype.slice.call(arguments, 1);
            handler.apply(this, args);
        }
        return true;

      } else if (isArray(handler)) {
        var args = Array.prototype.slice.call(arguments, 1);

        var listeners = handler.slice();
        for (var i = 0, l = listeners.length; i < l; i++) {
          listeners[i].apply(this, args);
        }
        return true;

      } else {
        return false;
      }
    };

    // EventEmitter is defined in src/node_events.cc
    // EventEmitter.prototype.emit() is also defined there.
    EventEmitter.prototype.addListener = function(type, listener) {
      if ('function' !== typeof listener) {
        throw new Error('addListener only takes instances of Function');
      }

      if (!this._events) this._events = {};

      // To avoid recursion in the case that type == "newListeners"! Before
      // adding it to the listeners, first emit "newListeners".
      this.emit('newListener', type, listener);

      if (!this._events[type]) {
        // Optimize the case of one listener. Don't need the extra array object.
        this._events[type] = listener;
      } else if (isArray(this._events[type])) {

        // Check for listener leak
        if (!this._events[type].warned) {
          var m;
          if (this._events.maxListeners !== undefined) {
            m = this._events.maxListeners;
          } else {
            m = defaultMaxListeners;
          }

          if (m && m > 0 && this._events[type].length > m) {
            this._events[type].warned = true;
            console.error('(node) warning: possible EventEmitter memory ' +
                          'leak detected. %d listeners added. ' +
                          'Use emitter.setMaxListeners() to increase limit.',
                          this._events[type].length);
            console.trace();
          }
        }

        // If we've already got an array, just append.
        this._events[type].push(listener);
      } else {
        // Adding the second element, need to change to array.
        this._events[type] = [this._events[type], listener];
      }

      return this;
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    EventEmitter.prototype.once = function(type, listener) {
      var self = this;
      self.on(type, function g() {
        self.removeListener(type, g);
        listener.apply(this, arguments);
      });

      return this;
    };

    EventEmitter.prototype.removeListener = function(type, listener) {
      if ('function' !== typeof listener) {
        throw new Error('removeListener only takes instances of Function');
      }

      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events || !this._events[type]) return this;

      var list = this._events[type];

      if (isArray(list)) {
        var i = indexOf(list, listener);
        if (i < 0) return this;
        list.splice(i, 1);
        if (list.length == 0)
          delete this._events[type];
      } else if (this._events[type] === listener) {
        delete this._events[type];
      }

      return this;
    };

    EventEmitter.prototype.removeAllListeners = function(type) {
      // does not use listeners(), so no side effect of creating _events[type]
      if (type && this._events && this._events[type]) this._events[type] = null;
      return this;
    };

    EventEmitter.prototype.listeners = function(type) {
      if (!this._events) this._events = {};
      if (!this._events[type]) this._events[type] = [];
      if (!isArray(this._events[type])) {
        this._events[type] = [this._events[type]];
      }
      return this._events[type];
    };

  });

  var em = new events.EventEmitter();
  em.setMaxListeners(0);



  var path = initModule("node_modules/path/path", function(require, exports) {

    function filter (xs, fn) {
        var res = [];
        for (var i = 0; i < xs.length; i++) {
            if (fn(xs[i], i, xs)) res.push(xs[i]);
        }
        return res;
    }

    // resolves . and .. elements in a path array with directory names there
    // must be no slashes, empty elements, or device names (c:\) in the array
    // (so also no leading and trailing slashes - it does not distinguish
    // relative and absolute paths)
    function normalizeArray(parts, allowAboveRoot) {
      // if the path tries to go above the root, `up` ends up > 0
      var up = 0;
      for (var i = parts.length; i >= 0; i--) {
        var last = parts[i];
        if (last == '.') {
          parts.splice(i, 1);
        } else if (last === '..') {
          parts.splice(i, 1);
          up++;
        } else if (up) {
          parts.splice(i, 1);
          up--;
        }
      }

      // if the path is allowed to go above the root, restore leading ..s
      if (allowAboveRoot) {
        for (; up--; up) {
          parts.unshift('..');
        }
      }

      return parts;
    }

    // Regex to split a filename into [*, dir, basename, ext]
    // posix version
    var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

    // path.resolve([from ...], to)
    // posix version
    exports.resolve = function() {
    var resolvedPath = '',
        resolvedAbsolute = false;

    for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
      var path = (i >= 0)
          ? arguments[i]
          : process.cwd();

      // Skip empty and invalid entries
      if (typeof path !== 'string' || !path) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charAt(0) === '/';
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
        return !!p;
      }), !resolvedAbsolute).join('/');

      return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
    };

    // path.normalize(path)
    // posix version
    exports.normalize = function(path) {
    var isAbsolute = path.charAt(0) === '/',
        trailingSlash = path.slice(-1) === '/';

    // Normalize the path
    path = normalizeArray(filter(path.split('/'), function(p) {
        return !!p;
      }), !isAbsolute).join('/');

      if (!path && !isAbsolute) {
        path = '.';
      }
      if (path && trailingSlash) {
        path += '/';
      }

      return (isAbsolute ? '/' : '') + path;
    };


    // posix version
    exports.join = function() {
      var paths = Array.prototype.slice.call(arguments, 0);
      return exports.normalize(filter(paths, function(p, index) {
        return p && typeof p === 'string';
      }).join('/'));
    };


    exports.dirname = function(path) {
      var dir = splitPathRe.exec(path)[1] || '';
      var isWindows = false;
      if (!dir) {
        // No dirname
        return '.';
      } else if (dir.length === 1 ||
          (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
        // It is just a slash or a drive letter with a slash
        return dir;
      } else {
        // It is a full dirname, strip trailing slash
        return dir.substring(0, dir.length - 1);
      }
    };


    exports.basename = function(path, ext) {
      var f = splitPathRe.exec(path)[2] || '';
      // TODO: make this comparison case-insensitive on windows?
      if (ext && f.substr(-1 * ext.length) === ext) {
        f = f.substr(0, f.length - ext.length);
      }
      return f;
    };


    exports.extname = function(path) {
      return splitPathRe.exec(path)[3] || '';
    };

    exports.relative = function(from, to) {
      from = exports.resolve(from).substr(1);
      to = exports.resolve(to).substr(1);

      function trim(arr) {
        var start = 0;
        for (; start < arr.length; start++) {
          if (arr[start] !== '') break;
        }

        var end = arr.length - 1;
        for (; end >= 0; end--) {
          if (arr[end] !== '') break;
        }

        if (start > end) return [];
        return arr.slice(start, end - start + 1);
      }

      var fromParts = trim(from.split('/'));
      var toParts = trim(to.split('/'));

      var length = Math.min(fromParts.length, toParts.length);
      var samePartsLength = length;
      for (var i = 0; i < length; i++) {
        if (fromParts[i] !== toParts[i]) {
          samePartsLength = i;
          break;
        }
      }

      var outputParts = [];
      for (var i = samePartsLength; i < fromParts.length; i++) {
        outputParts.push('..');
      }

      outputParts = outputParts.concat(toParts.slice(samePartsLength));

      return outputParts.join('/');
    };

  });




  // attach api
  self.require = load;
  self.define = define;
  self.require.get = require;
  self.require.inspect = function(module) {
    console.dir(module ? modules[module] : modules);
  };


}());

