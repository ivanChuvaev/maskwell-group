import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Product } from '../entity/Product'
import z from 'zod'
import { productUpdateCreateSchema } from '../schema/productUpdateCreateSchema'
import { Not } from 'typeorm'

export async function ProductPostUpdateAction(
    request: Request,
    response: Response
) {
    try {
        const id = Number(request.params.id)

        if (Number.isNaN(id)) {
            response.status(400).json('Invalid id')
            return
        }

        const productRepository = AppDataSource.getRepository(Product)

        const product = await productRepository.findOneBy({ id })

        if (!product) {
            response.status(404).json('Product not found')
            return
        }

        const body = productUpdateCreateSchema.parse(request.body)

        if (
            await productRepository.findOneBy({
                article: body.article,
                id: Not(id),
            })
        ) {
            response.status(409).json({
                message: 'Артикул уже существует',
                field: 'article',
            })
            return
        }

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
