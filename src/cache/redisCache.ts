
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'

const disabled = process.env.REDIS_DISABLED === 'true'


@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

    async get<T>(key: string): Promise<T | null> {
        if(disabled) return null

        return this.cache.get<T>(key)
    }

    async set<T>(key: string, value: T): Promise<void> {
        if(disabled) return

        return this.cache.set(key, value)
    }
}