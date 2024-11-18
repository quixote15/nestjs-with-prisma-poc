import prisma from "src/prisma"
import { WorkerWithDocuments } from "./workerStore"
import { Facility } from "@prisma/client"


const getFacilitiesOfWorker =  async (worker: WorkerWithDocuments): Promise<Facility[] | null> => {
    const documentIds = worker.documents.map(document => document.document_id)

    return prisma.facility.findMany({
        where: {
            is_active: true,
            requirements: {
                every: {
                    document_id: {
                        in: documentIds
                    }
                }
            }
        }
    })


}

export default {getFacilitiesOfWorker}