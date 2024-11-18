import { Facility, Shift } from "@prisma/client";
import { WorkerWithDocuments } from "./workerStore";
import prisma from "src/prisma";



export const getEligibleShifts = async (
    worker: WorkerWithDocuments,
    facilities: Facility[],
    cursor: number,
    pageSize = 10
): Promise<Shift[]> => {

    const facilityIds = facilities.map(facility => facility.id)

    return prisma.shift.findMany({
        skip: cursor ? 1 : 0, // cursor is id of last shift in previous page, so we skip 1 if cursor is present
        take: pageSize,
        cursor: cursor ? { id: cursor } : undefined,
        where : {
            is_deleted: false,
            worker_id: null,
            profession: worker.profession,
            facility_id: {
                in: facilityIds
            }
        },
        orderBy: {id: 'asc'}
    })
}