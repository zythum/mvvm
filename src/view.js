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
  setStates: function () {
    
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

