import { Request, Response, NextFunction } from 'express';
import { IProviderService } from '@/lib/services/interfaces/IProviderService';

export default (providerService: IProviderService) => async (
  _req: Request, // Underscore if not used
  res: Response,
  next: NextFunction
) => {
  try {
    const providers = await providerService.getProviders();
    return res.status(200).json(providers);
  } catch (err) {
    next(err);
  }
};
