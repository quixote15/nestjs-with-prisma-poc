import { DocumentWorker, Worker } from '@prisma/client'
import prisma from '../prisma' 


export type WorkerWithDocuments = Worker & {
    documents: DocumentWorker[]
}


export const getWorkerWithDocuments = async (workerId: number): Promise<WorkerWithDocuments | null> => {
    return prisma.worker.findUnique({
        where: {
            id: workerId
        },
        include: {
            documents: true
        }
    })
}