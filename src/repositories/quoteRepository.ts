import { localStorageAdapter, storageKeys } from '../storage/localStorage'
import type { Quote, UiSettings } from '../types'
import { cloneQuote } from '../lib/quoteFactory'

export interface QuoteRepository {
  getDraft(): Quote | null
  saveDraft(quote: Quote): void
  list(): Quote[]
  find(id: string): Quote | null
  save(quote: Quote): Quote
  delete(id: string): void
  duplicate(id: string): Quote | null
  getRecentServices(): string[]
  addRecentService(serviceId: string): void
  getUiSettings(): UiSettings
  saveUiSettings(settings: UiSettings): void
}

const defaultUiSettings: UiSettings = {
  category: 'all',
  sort: 'recommended',
  compact: true,
}

export class LocalStorageQuoteRepository implements QuoteRepository {
  getDraft() {
    return localStorageAdapter.read<Quote | null>(storageKeys.draft, null)
  }

  saveDraft(quote: Quote) {
    localStorageAdapter.write(storageKeys.draft, { ...quote, updatedAt: new Date().toISOString() })
  }

  list() {
    return localStorageAdapter
      .read<Quote[]>(storageKeys.savedQuotes, [])
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }

  find(id: string) {
    return this.list().find((quote) => quote.id === id) ?? null
  }

  save(quote: Quote) {
    const saved = { ...structuredClone(quote), updatedAt: new Date().toISOString() }
    const quotes = this.list().filter((item) => item.id !== saved.id)
    localStorageAdapter.write(storageKeys.savedQuotes, [saved, ...quotes])
    this.saveDraft(saved)
    return saved
  }

  delete(id: string) {
    localStorageAdapter.write(
      storageKeys.savedQuotes,
      this.list().filter((quote) => quote.id !== id),
    )
  }

  duplicate(id: string) {
    const source = this.find(id)
    if (!source) return null
    const duplicated = cloneQuote(source)
    return this.save(duplicated)
  }

  getRecentServices() {
    return localStorageAdapter.read<string[]>(storageKeys.recentServices, [])
  }

  addRecentService(serviceId: string) {
    const recent = this.getRecentServices().filter((id) => id !== serviceId)
    localStorageAdapter.write(storageKeys.recentServices, [serviceId, ...recent].slice(0, 8))
  }

  getUiSettings() {
    return localStorageAdapter.read<UiSettings>(storageKeys.uiSettings, defaultUiSettings)
  }

  saveUiSettings(settings: UiSettings) {
    localStorageAdapter.write(storageKeys.uiSettings, settings)
  }
}

export const quoteRepository = new LocalStorageQuoteRepository()
