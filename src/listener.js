var utils = require('utils')

function Listener () {
  this.map = {}
}
Listener.prototype = {
  getByPath: function (path, createIfEmpty) {
    // path = path.split('.')
    // var res = this.map, _res, one
    // while (one = path.shift()) {
    //   if (_res = res[one]) {        
    //     if (createIfEmpty) _res = res[one] = {__callbacks: []}
    //     else return undefined
    //   }
    //   res = _res
    // }
    // return res
    
    var res = this.map[path]
    if (!res && createIfEmpty) res = this.map[path] = {__callbacks: []}
    return res
  },
  on: function (path, callback, originValue, setOriginValueOnce) {
    var store = this.getByPath(path, true)
    store.__callbacks.push(callback)
    if ( arguments.length > 2 && !('__value' in store && setOriginValueOnce) ) {
      store.__value = originValue
    }
  },
  remove: function (path, callback) {
    var store = this.getByPath(path)
    if (store) utils.removeFromArray(callback, store.__callbacks)
  },
  removeAll:function (path) {
    var store = this.getByPath(path)
    if (store) store.__callbacks = []
  },
  trigger: function (path, value) {
    var store = this.getByPath(path, true)

  },
  destroy: function () {

  }
}

