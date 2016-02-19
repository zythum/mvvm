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