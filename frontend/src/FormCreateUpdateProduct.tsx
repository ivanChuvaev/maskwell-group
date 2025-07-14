import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Product } from './types/Product'

const schema = z.object({
  name: z.string().min(1, { message: 'Название не может быть пустым' }),
  article: z.string().min(1, { message: 'Артикул не может быть пустым' }),
  price: z
    .number('Цена не может быть пустой')
    .min(1, { message: 'Цена не может быть меньше 1' }),
  quantity: z
    .number('Количество не может быть пустым')
    .positive({ message: 'Количество не может быть отрицательным' }),
})

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

type FormCreateUpdateProductProps = {
  id?: number
  onSuccess?: () => void
}

export const FormCreateUpdateProduct = ({
  id,
  onSuccess,
}: FormCreateUpdateProductProps) => {
  const { data: product, isLoading } = useQuery<Product | undefined>({
    queryKey: ['products', id],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BACKEND_URL}/products/${id}`).then((res) =>
        res.json()
      ),
    enabled: !!id,
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    values: product,
  })

  const queryClient = useQueryClient()

  const { mutate: createProduct } = useMutation({
    mutationFn: (data: z.infer<typeof schema>) =>
      fetch(`${import.meta.env.VITE_BACKEND_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      onSuccess?.()
      queryClient.invalidateQueries({
        queryKey: ['products'],
      })
    },
  })

  const { mutate: updateProduct } = useMutation({
    mutationFn: (data: z.infer<typeof schema>) =>
      fetch(`${import.meta.env.VITE_BACKEND_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      onSuccess?.()
      queryClient.invalidateQueries({
        queryKey: ['products'],
      })
    },
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (id) {
      updateProduct(data)
    } else {
      createProduct(data)
    }
  }

  if (isLoading) {
    return <div>Загрузка продукта...</div>
  }

  return (
    <form
      className="flex flex-col gap-4 w-100"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className="text-l font-bold">
        {id ? 'Редактирование продукта' : 'Добавление продукта'}
      </h3>
      <Input
        label="Название"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label="Артикул"
        {...register('article')}
        error={errors.article?.message}
      />
      <Button
        type="button"
        onClick={() => {
          setValue('article', generateArticle(), { shouldValidate: true })
        }}
      >
        Сгенерировать артикул
      </Button>
      <Input
        label="Цена"
        {...register('price', {
          setValueAs: (value) => {
            if (value === '' || value === null || value === undefined) return 0
            const num = Number(value)
            return isNaN(num) ? 0 : num
          },
        })}
        error={errors.price?.message}
      />
      <Input
        label="Количество"
        {...register('quantity', {
          setValueAs: (value) => {
            if (value === '' || value === null || value === undefined) return 0
            const num = Number(value)
            return isNaN(num) ? 0 : num
          },
        })}
        error={errors.quantity?.message}
      />
      <Button type="submit" disabled={!isDirty}>
        {id ? 'Сохранить' : 'Добавить'}
      </Button>
    </form>
  )
}
