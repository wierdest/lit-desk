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

export function makeFakeJson (model, quantity) {
  const generateValue = (value) => {
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'string') {
        return Math.random().toString(36).substring(2, 10)
      }
      if (value.toLowerCase() === 'email') {
        return `user${Math.floor(Math.random() * 1000)}@example.com`;
      }
      if (value.slice(0, 6) === 'picsum') {
        

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

  const generateObject = (obj) => {
    const result = {}
    for (const key in obj) {
      result[key] = generateValue(obj[key])
    }
    return result
  }

  const fakeData = []
  for (let i = 0; i < quantity; i++) {
    fakeData.push(generateObject(model))
  }
  return fakeData
}