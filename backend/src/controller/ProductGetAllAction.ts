import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Product } from '../entity/Product'

export async function ProductGetAllAction(
    request: Request,
    response: Response
) {
    try {
        let limit = Number(request.query.limit)
        let page = Number(request.query.page)

        if (Number.isNaN(limit)) {
            limit = 10
        }

        if (Number.isNaN(page)) {
            page = 1
        }

        page = Math.max(page, 1)
        limit = Math.max(limit, 1)

        const productRepository = AppDataSource.getRepository(Product)

        const data = await productRepository.find({
            skip: (page - 1) * limit,
            take: limit,
            order: {
                id: 'ASC',
            },
        })

        const total = await productRepository.count()

        response.json({ data, total })
    } catch (e) {
        if (e instanceof Error) {
            response.status(500).json(e.message)
        } else {
            response.sendStatus(500)
        }
    }
}
