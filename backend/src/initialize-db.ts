import { AppDataSource } from './data-source'
import { Product } from './entity/Product'

const generateArticle = (): string => {
    const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const randomLetters =
        letters.charAt(Math.floor(Math.random() * letters.length)) +
        letters.charAt(Math.floor(Math.random() * letters.length))

    return `${randomLetters}-${random}`
}

export const initializeDb = async () => {
    const productRepository = AppDataSource.getRepository(Product)

    await productRepository.clear()

    const products = Array.from({ length: 100 }, (_, i) =>
        productRepository.create({
            name: `TEST-${i.toString().padStart(3, '0')}`,
            article: generateArticle(),
            price: Math.floor(1 + Math.random() * 1000),
            quantity: Math.floor(1 + Math.random() * 100),
        })
    )

    await productRepository.save(products)
}
