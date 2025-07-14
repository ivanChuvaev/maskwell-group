import { ModalRenderer } from './modal'
import { ProductTable } from './ProductTable'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductTable />
      <ModalRenderer />
    </QueryClientProvider>
  )
}
