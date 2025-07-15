import type { Product } from './types/Product'
import { modalStore } from './modal'
import { FormCreateUpdateProduct } from './FormCreateUpdateProduct'
import { Button } from './ui/Button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

const POSSIBLE_LIMITS = [5, 10, 20, 50, 100]

const getUrlParams = () => {
  const searchParams = new URLSearchParams(window.location.search)
  return {
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '10', 10),
  }
}

const updateUrlParams = (page: number, limit: number) => {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.set('page', page.toString())
  searchParams.set('limit', limit.toString())
  window.history.replaceState(null, '', `?${searchParams.toString()}`)
}

export const ProductTable = () => {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(() => getUrlParams().page)
  const [limit, setLimit] = useState(() => getUrlParams().limit)

  const { data, isLoading } = useQuery<{ data: Product[]; total: number }>({
    queryKey: ['products', page, limit],
    queryFn: () =>
      fetch(
        `${import.meta.env.VITE_BACKEND_URL}/products?page=${page}&limit=${limit}`
      ).then((res) => res.json()),
    placeholderData: (previousData) => previousData,
  })

  const { data: products, total: totalCount } = data ?? {}

  const hasNextPage = totalCount !== undefined && totalCount > page * limit
  const hasPreviousPage = page > 1

  const { mutate: deleteProduct } = useMutation({
    mutationKey: ['delete-product'],
    mutationFn: (id: Product['id']) =>
      fetch(`${import.meta.env.VITE_BACKEND_URL}/products/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const openFormCreateProduct = () => {
    modalStore.openModal(
      'form-create-product',
      <FormCreateUpdateProduct
        onSuccess={() => {
          modalStore.closeModal('form-create-product')
        }}
      />
    )
  }

  const openFormEditProduct = (product: Product) => {
    modalStore.openModal(
      `form-edit-product-${product.id}`,
      <FormCreateUpdateProduct
        id={product.id}
        onSuccess={() => {
          modalStore.closeModal(`form-edit-product-${product.id}`)
        }}
      />
    )
  }

  useEffect(() => {
    updateUrlParams(page, limit)
  }, [page, limit])

  useEffect(() => {
    const handlePopState = () => {
      const { page: urlPage, limit: urlLimit } = getUrlParams()
      setPage(urlPage)
      setLimit(urlLimit)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (totalCount && page > Math.ceil(totalCount / limit)) {
      setPage(Math.ceil(totalCount / limit))
    }
  }, [totalCount])

  useEffect(() => {
    if (!POSSIBLE_LIMITS.includes(limit)) {
      let distance = Math.abs(POSSIBLE_LIMITS[0] - limit)
      let minLimit = POSSIBLE_LIMITS[0]

      for (let i = 1; i < POSSIBLE_LIMITS.length; i++) {
        const currentDistance = Math.abs(POSSIBLE_LIMITS[i] - limit)
        if (currentDistance < distance) {
          distance = currentDistance
          minLimit = POSSIBLE_LIMITS[i]
        }
      }

      setLimit(minLimit)
    }
  }, [limit])

  return (
    <div className="md:container md:mx-auto my-4">
      <div className="mb-4">
        <Button onClick={openFormCreateProduct}>Добавить продукт</Button>
      </div>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="text-left border-b border-t border-gray-200 bg-gray-100">
              <th className="p-2">ID</th>
              <th className="p-2">Название</th>
              <th className="p-2">Артикул</th>
              <th className="p-2">Цена</th>
              <th className="p-2">Количество</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-200 last:border-b-0"
              >
                <td className="p-2">{product.id}</td>
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.article}</td>
                <td className="p-2">{product.price}</td>
                <td className="p-2">{product.quantity}</td>
                <td className="p-2 flex justify-end gap-2">
                  <Button onClick={() => openFormEditProduct(product)}>
                    Редактировать
                  </Button>
                  <Button onClick={() => deleteProduct(product.id)}>
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex items-center gap-4 mt-4">
        <select
          className="border border-gray-300 rounded-lg min-h-8 px-1"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value))
            setPage(1)
          }}
        >
          {POSSIBLE_LIMITS.map((limit) => (
            <option key={limit} value={limit}>
              {limit}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          {(hasPreviousPage || hasNextPage) && !!totalCount && (
            <>
              <Button
                onClick={() => setPage(Math.max(page - 1, 0))}
                disabled={!hasPreviousPage}
              >
                Предыдущая
              </Button>
              <span className="text-gray-500 flex items-center justify-center">
                {page} / {Math.ceil(totalCount / limit)}
              </span>
              <Button onClick={() => setPage(page + 1)} disabled={!hasNextPage}>
                Следующая
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
