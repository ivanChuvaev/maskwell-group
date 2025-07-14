import { useEffect } from 'react'
import { useState } from 'react'
import { modalStore } from './modalStore'

export const ModalRenderer = () => {
  const [modals, setModals] = useState(() => modalStore.getModals())

  useEffect(() => {
    return modalStore.subscribe(setModals)
  }, [])

  useEffect(() => {
    if (modals.length > 0) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          modalStore.closeLastModal()
        }
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [modals.length])

  if (modals.length === 0) return null

  return (
    <div className="modal-renderer">
      <div className="fixed inset-0 bg-black opacity-25" />
      {modals.map(([id, node], index) => (
        <div key={id} className="modal-renderer-item">
          {index === modals.length - 1 && (
            <div
              className="fixed inset-0"
              onClick={() => modalStore.closeModal(id)}
            />
          )}
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
            <div className="pointer-events-auto p-6 bg-white rounded-lg shadow-lg">
              {node}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
