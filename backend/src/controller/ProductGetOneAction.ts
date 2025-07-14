import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Product } from '../entity/Product'

export async function ProductGetOneAction(
    request: Request,
    response: Response
) {
    try {
        const id = Number(request.params.id)

        if (Number.isNaN(id)) {
            response.status(400).json({ message: 'Invalid id' })
            return
        }

        const productRepository = AppDataSource.getRepository(Product)

        const product = await productRepository.findOneBy({ id })

        if (!product) {
            response.status(404).json({ message: 'Not found' })
            return
        }

        response.json(product)
    } catch (e) {
        if (e instanceof Error) {
            response.status(500).json(e.message)
        } else {
            response.sendStatus(500)
        }
    }
}
