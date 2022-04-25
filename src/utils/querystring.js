/* eslint-disable */
function querystring (obj, sep, eq, arrayKey) {
  if (!isPlainObject(obj)) return ''

  sep = sep || '&'
  eq = eq || '='
  arrayKey = arrayKey || false

  let buf = []
  let key
  let val
  let escape = encodeURIComponent

  for (key in obj) {
    if (!hasOwnProperty.call(obj, key)) continue

    val = obj[key]
    key = escape(key)
    // val is primitive value
    if (isPrimitive(val)) {
      buf.push(key, eq, escape(val + ''), sep)
    } else if (isArray(val) && val.length) { // val is not empty array
      for (var i = 0; i < val.length; i++) {
        if (isPrimitive(val[i])) {
          buf.push(
            key,
            (arrayKey ? escape('[]') : '') + eq,
            escape(val[i] + ''),
            sep)
        }
      }
    } else { // ignore other cases, including empty array, Function, RegExp, Date etc.
      buf.push(key, eq, sep)
    }
  }
  buf.pop()
  return buf.join('')
}

export default querystring
const toString = Object.prototype.toString
const isArray = Array.isArray || function (val) {
  return toString.call(val) === '[object Array]'
}
/**
 * If the type of o is null, undefined, number, string, boolean,
 * return true.
 */
function isPrimitive (o) {
  return o !== Object(o)
}

/**
 * Checks to see if an object is a plain object (created using "{}" or
 * "new Object()" or "new FunctionClass()").
 */
function isPlainObject (o) {
  /**
   * NOTES:
   * isPlainObject(node = document.getElementById("xx")) -> false
   * toString.call(node):
   *   ie678 === '[object Object]', other === '[object HTMLElement]'
   * 'isPrototypeOf' in node:
   *   ie678 === false, other === true
   */
  return o &&
    toString.call(o) === '[object Object]' &&
    'isPrototypeOf' in o
}
