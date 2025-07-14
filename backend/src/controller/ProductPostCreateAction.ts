import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Product } from '../entity/Product'
import z from 'zod'

const bodySchema = z.object({
    name: z.string('Name must be string').min(1, 'Name is required'),
    article: z.string('Article must be string').min(1, 'Article is required'),
    price: z.number('Price must be number'),
    quantity: z.number('Quantity must be number'),
})

export async function ProductPostCreateAction(
    request: Request,
    response: Response
) {
    try {
        const body = bodySchema.parse(request.body)

        const productRepository = AppDataSource.getRepository(Product)

        const product = new Product()
        product.name = body.name
        product.article = body.article
        product.price = body.price
        product.quantity = body.quantity

        const dbProduct = await productRepository.save(product)

        response.json(dbProduct)
    } catch (e) {
        if (e instanceof z.ZodError) {
            response.status(400).json({ message: z.treeifyError(e) })
            return
        }
        if (e instanceof Error) {
            response.status(500).json(e.message)
        } else {
            response.sendStatus(500)
        }
    }
}
