import { Inject, Injectable } from '@nestjs/common';
import facilityStore from './stores/facilityStore';
import { getEligibleShifts } from './stores/shiftStore';
import { getWorkerWithDocuments, WorkerWithDocuments } from './stores/workerStore';
import { Facility } from '@prisma/client';
import { CacheService } from './cache/redisCache';

@Injectable()
export class AppService {
  constructor(private readonly cache: CacheService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getWorkerWithDocuments(workerId: number): Promise<WorkerWithDocuments | null> {
    const cacheKey = `worker-${workerId}`

    const cachedWorker = await this.cache.get<WorkerWithDocuments>(cacheKey)

    if(cachedWorker) return cachedWorker

    return getWorkerWithDocuments(workerId)
  }


  async getFacilitiesOfWorker(worker: WorkerWithDocuments): Promise<Facility[] | null> {
    const cacheKey = `facilities-${worker.id}`
    const cachedFacilities = await this.cache.get<Facility[]>(cacheKey)

    if(cachedFacilities) return cachedFacilities

    const facilities =  await facilityStore.getFacilitiesOfWorker(worker)
    this.cache.set(cacheKey, facilities)

    return facilities

  }

  async getAvailableShifts(workerId: number) {
    const cacheKey = `shifts-${workerId}`
    
    const cachedShifts = await this.cache.get(cacheKey)

    if(cachedShifts) return cachedShifts

    const worker = await this.getWorkerWithDocuments(workerId)
    const facilities = await this.getFacilitiesOfWorker(worker)
    const shifts = await getEligibleShifts(worker, facilities, 0)

    this.cache.set(cacheKey, shifts) 

    return shifts
  }
}
