(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var defaultBreakNext = false
var defaultPriority = 500

function Directive () {}
Directive.createDirective = function (generater, args) {

  function Directive (el, args, keyPath, formatters, options) {
    this.el = el
    this.options = options
    this.keyPath = keyPath

    generater.apply(this, args)
  }

  Directive.breakNext = options.break || defaultBreakNext
  Directive.priority = options.priority || defaultPriority
  
  Directive.prototype.render = function () {}
  Directive.prototype.destroy = function () {}

  return Directive
}

module.exports = Directive
},{}],2:[function(require,module,exports){
module.exports = {
  directives: {}
}
},{}],3:[function(require,module,exports){
var global = require('./global')
var View = require('./view')
var Directive = require('./directive')

window.mvvm = {
  global: global,
  View: View,
  Directive: Directive
}
},{"./directive":1,"./global":2,"./view":5}],4:[function(require,module,exports){

// isArguments
// isFunction
// isString
// isNumber
// isDate
// isRegExp
// isError

var toString = ({}).toString;

['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Array'].forEach(function(name) {
  exports['is' + name] = function(obj) {
    return toString.call(obj) === '[object ' + name + ']';
  }
})

exports.removeFromArray = function (item, array) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === item) array.splice(i--, 1), len--
  }
}
},{}],5:[function(require,module,exports){
var global = require('./global')
var uitls = require('./utils')

var directiveRegExp = /^\(([a-zA-Z0-9\_\-]+)\)$/
var directiveSplitRegExp = /\s*\.\s*/
var formatterSplitRegExp = /\s*\|\s*/

function parser (element, callback) {
  if (!element) return
  if (callback(element) && element.firstChild) parser(element.firstChild)
  if (element.nextSibling) parser(element.nextSibling)
}

function eachObject (obj, iteratee) {
  for (i in obj) {
    if (i.indexOf('__') != 0 && obj.hasOwnProperty(i)) {
      
    }
  }
}

function View (rootElement, generater, options) {
  this.rootElement = rootElement
  this.directives = Object.assign({}, global.directives, options.withDirectives)
  this.formatters = Object.assign({}, global.formatters, options.withFormatters)
  this.directiveIntances = []

  if (uitls.isString(options.withTemplate)) rootElement.innerHTML = options.withTemplate

  this.states = {}

  this.handler = {
    states: this.states,
    setStates: this.setStates.bind(this)
  }

  generater.call(this.handler)
  this.build()
}

View.prototype = {
  build: function () {
    parser(rootElement, function (element) {
      switch (element.nodeType) {
        //标签节点
        case 1: 
          this.bindDirective(element)
          break
      }
    })
  },
  setStates: function (states) {
    
  },
  bindDirective: function (element) {
    var directives = []
    for (var match, i = 0, len = element.attributes; i < len; i++) {
      if ( match = name.match(element.attributes[i].name) && match[1]) {
        var directiveArgs = match[1].trim.split(directiveSplitRegExp)
        var directiveName = directiveArgs.shift()

        var formatterNames = element.attributes[i].value.split(formatterSplitRegExp)
        var keyPath = formatterNames.shift()

        formatter = formatterNames.map(function (formatterName) {
          return this.formatters[formatterName] || function () {}
        })

        if (this.directives.hasOwnProperty(directiveName)) {
          directives.push({
            directive: this.directives[directiveName], 
            args: directiveArgs,
            keyPath: keyPath,
            formatter: formatter
          })
        }
      }
    }
    directives = directives.sort(function (one, otherOne) {
      return otherOne.directive.priority - one.directive.priority
    })

    for (var Directive, i = 0, len = directives.length, breakNext; i < len; i++) {
      Directive = directives.directive[i]
      this.directiveIntances.push(
        new Directive(
          element, 
          directives.args,
          directives.keyPath,
          directives.formatter,
          options
        )
      )
      if (Directive.breakNext) break
    }
  }

}

module.exports = View


},{"./global":2,"./utils":4}]},{},[3]);
