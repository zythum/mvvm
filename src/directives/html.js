var Directive = require('./directive')

module.export = Directive.create(function (arguments) {
  this.render = function (lastValue, newValue) { this.el.innerHTML = newValue }
}, {
  priority: 500
  breakNext: false
})