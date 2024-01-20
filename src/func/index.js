export const saveLocal = (key) => {
  let isKeyExist = localStorage.getItem(`${key}`)
  if (isKeyExist) {
    return JSON.parse(localStorage.getItem(`${key}`))
  } else {
    return ''
  }
}
export const paginate = (data) => {
  const itemsPerPage = 10

  const numberOfPages = Math.ceil(data.length / itemsPerPage)

  const newData = Array.from({ length: numberOfPages }, (_, index) => {
    const start = index * itemsPerPage
    return data.slice(start, start + itemsPerPage)
  })

  return newData
}
