export default function isEmpty(obj, excepts = [], debug = false) {
  if (Object.keys(obj).length == 0) return true

  const items = Object.entries(obj)

  for (const [key, value] of items) {
    if (!excepts.includes(key)) {
      if (debug) console.log(key)
      if (!(value === 0)) {
        if (value == '' || value == undefined) {
          return true
        }
      }
    }
  }
  return false
}
