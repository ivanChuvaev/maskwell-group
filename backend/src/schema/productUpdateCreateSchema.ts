import { z } from 'zod'

export const productUpdateCreateSchema = z.object({
    name: z.preprocess(
        (value) => (typeof value === 'string' ? value.trim() : value),
        z
            .string()
            .min(1, { message: 'Название не может быть пустым' })
            .max(100, {
                message: 'Название не может быть длиннее 100 символов',
            })
    ),
    article: z
        .preprocess(
            (val) => (typeof val === 'string' ? val.trim() : val),
            z
                .string()
                .min(1, { message: 'Артикул не может быть пустым' })
                .max(10, {
                    message: 'Артикул не может быть длиннее 10 символов',
                })
        )
        .transform((value) => value.trim()),
    price: z
        .number('Цена обязательна')
        .min(1, { message: 'Цена не может быть меньше 1' })
        .max(1000000, { message: 'Цена не может быть больше 1000000' }),
    quantity: z
        .number('Количество обязательно')
        .min(0, { message: 'Количество не может быть меньше 0' })
        .max(1000000, { message: 'Количество не может быть больше 1000000' }),
})
