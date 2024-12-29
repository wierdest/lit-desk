/**
 * Gera um array de objetos JSON com base em um modelo fornecido.
 * @param {Object} model - O modelo que define a estrutura dos objetos JSON gerados.
 *   As chaves representam os campos, e os valores especificam o tipo ou estrutura:
 *   - `'string'`: Gera uma string aleatória
 *   - `'email'`: Gera um email aleatório
 *   - `'date'`: Gera uma string de data no formato ISO aleatória
 *   - `'number'`: Gera um número aleatório
 *   - `'boolean'`: Gera um valor booleano aleatório
 *   - `'picsumRES'`: Gera uma imagem aleatória de RESpx x RESpx através do serviço `https://picsum.photos/RES?random=n`
 *   - `Array`: Seleciona aleatoriamente um elemento do array
 *   - `Object`: Gera um objeto aninhado com base na estrutura fornecida
 * @param {number} quantity - A quantidade de objetos JSON a ser gerada.
 * @returns {Object[]} Um array de objetos JSON que segue a estrutura definida no modelo.
 * @example
 * const model = {
 *   id: 'number',
 *   name: 'string',
 *   email: 'email',
 *   active: 'boolean',
 *   createdAt: 'date',
 *   photo: 'picsum400',
 *   role: ['admin', 'user', 'guest']
 * }
 * const data = makeFakeJson(model, 5)
 * console.log(data)
 */

export function makeFakeJson (model, quantity, indexBased) {
  let indexBeingGenerated = -1
  const generateIndexBasedValue = (value) => {
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'string') {
        return `string index ${indexBeingGenerated}`
      }
      if (value.toLowerCase() === 'email') {
        return `user ${indexBeingGenerated}@example.com`
      }
      if (value.startsWith('picsum')) {
        const res = value.substring(6)
        return `https://picsum.photos/id/${indexBeingGenerated}/${res}`
      }
      if (value.toLowerCase() === 'date') {
        const epoch = new Date(0)
        return new Date(epoch.getTime() + indexBeingGenerated * 86400000).toISOString()
      }
    } else if (typeof value === 'number') {
      return indexBeingGenerated * 1000
    } else if (typeof value === 'boolean') {
      return indexBeingGenerated % 2 === 0
    } else if (Array.isArray(value)) {
      return indexBeingGenerated <= value.length - 1 ? value[indexBeingGenerated] : value[(value.length - 1) % indexBeingGenerated]
    } else if (typeof value === 'object' && value !== null) {
      return generateObject(value, true)
    }
  }
  const generateRandomValue = (value) => {
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'string') {
        return Math.random().toString(36).substring(2, 10)
      }
      if (value.toLowerCase() === 'email') {
        return `user${Math.floor(Math.random() * 1000)}@example.com`
      }
      if (value.startsWith('picsum')) {
        const resolution = value.substring(6)
        return `https://picsum.photos/${resolution}?random=${indexBeingGenerated}`
      }
      if (value.toLowerCase() === 'date') {
        return new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString()
      }
    } else if (typeof value === 'number') {
      return Math.floor(Math.random() * 1000)
    } else if (typeof value === 'boolean') {
      return Math.random() < 0.5
    } else if (Array.isArray(value)) {
      return value[Math.floor(Math.random() * value.length)]
    } else if (typeof value === 'object' && value !== null) {
      return generateObject(value)
    }
    return null
  }

  const generateObject = (obj, indexBased) => {
    const result = {}
    for (const key in obj) {
      result[key] = indexBased ? generateIndexBasedValue(obj[key]) : generateRandomValue(obj[key])
    }
    return result
  }

  const fakeData = []
  for (let i = 0; i < quantity; i++) {
    indexBeingGenerated = i
    fakeData.push(generateObject(model, indexBased))
  }
  return fakeData
}
