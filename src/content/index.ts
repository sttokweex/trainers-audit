import type { ContentPack } from '@/engine/types'

export type PackId = 'audit'
export const DEFAULT_PACK: PackId = 'audit'
export const PACK_META = [{ id: 'audit', title: 'Аудит' }] as const

const cache = new Map<PackId, Promise<ContentPack>>()

export function loadPack(_id: string): Promise<ContentPack> {
  let promise = cache.get(DEFAULT_PACK)
  if (!promise) {
    promise = import('./audit').then((module) => module.auditPack)
    cache.set(DEFAULT_PACK, promise)
  }
  return promise
}
