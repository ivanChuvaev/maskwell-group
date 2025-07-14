import type { ReactNode } from 'react'

class ModalStore {
  private nodes: Map<string, ReactNode>
  private ids: string[]
  private subscribers: ((modals: [string, ReactNode][]) => void)[]

  constructor() {
    this.nodes = new Map()
    this.ids = []
    this.subscribers = []
  }

  openModal(id: string, node: ReactNode) {
    if (this.nodes.has(id) || this.ids.includes(id)) return
    this.nodes.set(id, node)
    this.ids.push(id)
    this.notifySubscribers()
  }

  closeModal(id: string) {
    this.nodes.delete(id)
    this.ids = this.ids.filter((i) => i !== id)
    this.notifySubscribers()
  }

  closeLastModal() {
    this.nodes.delete(this.ids[this.ids.length - 1])
    this.ids.pop()
    this.notifySubscribers()
  }

  getModals() {
    return Array.from(this.nodes.entries())
  }

  subscribe(callback: (modals: [string, ReactNode][]) => void) {
    this.subscribers.push(callback)

    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback)
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach((cb) => cb(this.getModals()))
  }
}

export const modalStore = new ModalStore()
