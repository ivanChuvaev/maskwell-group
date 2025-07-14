import { ProductDeleteAction } from './controller/ProductDeleteAction'
import { ProductGetAllAction } from './controller/ProductGetAllAction'
import { ProductGetOneAction } from './controller/ProductGetOneAction'
import { ProductPostCreateAction } from './controller/ProductPostCreateAction'
import { ProductPostUpdateAction } from './controller/ProductPostUpdateAction'

export const routes = [
    {
        method: 'get',
        path: '/products',
        action: ProductGetAllAction,
    },
    {
        method: 'get',
        path: '/products/:id',
        action: ProductGetOneAction,
    },
    {
        method: 'post',
        path: '/products',
        action: ProductPostCreateAction,
    },
    {
        method: 'put',
        path: '/products/:id',
        action: ProductPostUpdateAction,
    },
    {
        method: 'delete',
        path: '/products/:id',
        action: ProductDeleteAction,
    },
] as const
