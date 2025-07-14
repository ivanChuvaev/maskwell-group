import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Product } from '../entity/Product'

export async function ProductDeleteAction(
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

        await productRepository.remove(product)

        response.sendStatus(204)
    } catch (e) {
        if (e instanceof Error) {
            response.status(500).json(e.message)
        } else {
            response.sendStatus(500)
        }
    }
}
