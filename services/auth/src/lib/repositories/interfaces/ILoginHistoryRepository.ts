import { LoginHistory } from '@prisma/client';

export interface ILoginHistoryRepository {
  create(data: any): Promise<LoginHistory>;
}
