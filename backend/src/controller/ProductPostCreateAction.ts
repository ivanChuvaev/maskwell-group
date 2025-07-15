import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Product } from '../entity/Product'
import z from 'zod'
import { productUpdateCreateSchema } from '../schema/productUpdateCreateSchema'

export async function ProductPostCreateAction(
    request: Request,
    response: Response
) {
    try {
        const body = productUpdateCreateSchema.parse(request.body)

        const productRepository = AppDataSource.getRepository(Product)

        if (await productRepository.findOneBy({ article: body.article })) {
            response.status(409).json({
                message: 'Артикул уже существует',
                field: 'article',
            })
            return
        }

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
