
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