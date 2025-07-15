import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Product } from './types/Product'

const schema = z.object({
  name: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : value),
    z
      .string()
      .min(1, { message: 'Название не может быть пустым' })
      .max(100, { message: 'Название не может быть длиннее 100 символов' })
  ),
  article: z
    .preprocess(
      (val) => (typeof val === 'string' ? val.trim() : val),
      z
        .string()
        .min(1, { message: 'Артикул не может быть пустым' })
        .max(10, { message: 'Артикул не может быть длиннее 10 символов' })
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
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product | undefined>({
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
    setError,
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
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(JSON.stringify(errorData))
        }
        return res.json()
      }),
    onSuccess: () => {
      onSuccess?.()
      queryClient.invalidateQueries({
        queryKey: ['products'],
      })
    },
    onError: (error: Error) => {
      const errorData = JSON.parse(error.message)
      if (errorData.field === 'article' && errorData.message) {
        setError('article', { message: errorData.message })
        return
      }
      alert(`Error creating product: ${error.message}`)
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
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(JSON.stringify(errorData))
        }
        return res.json()
      }),
    onSuccess: () => {
      onSuccess?.()
      queryClient.invalidateQueries({
        queryKey: ['products'],
      })
    },
    onError: (error: Error) => {
      const errorData = JSON.parse(error.message)
      if (errorData.field === 'article' && errorData.message) {
        setError('article', { message: errorData.message })
        return
      }
      alert(`Error updating product: ${error.message}`)
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

  if (error) {
    return <div>Не удалось загрузить продукт: {error.message}</div>
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
          setValue('article', generateArticle(), {
            shouldValidate: true,
            shouldTouch: true,
            shouldDirty: true,
          })
        }}
      >
        Сгенерировать артикул
      </Button>
      <Input
        label="Цена"
        type="number"
        {...register('price', { valueAsNumber: true })}
        error={errors.price?.message}
      />
      <Input
        label="Количество"
        type="number"
        {...register('quantity', { valueAsNumber: true })}
        error={errors.quantity?.message}
      />
      <Button type="submit" disabled={!isDirty}>
        {id ? 'Сохранить' : 'Добавить'}
      </Button>
    </form>
  )
}
