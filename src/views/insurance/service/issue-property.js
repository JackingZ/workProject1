export function texts(sources) {
  const res = []
  sources.forEach(item => res.push(item.text))
  return res
}
