import { Medication, Prisma } from "@prisma/client";

export interface IMedicationRepository {
  create(data: Prisma.MedicationCreateInput): Promise<Medication>;
  findMany(): Promise<Medication[]>;
  findManyByEhrId(ehrId: string): Promise<Medication[]>;
}
