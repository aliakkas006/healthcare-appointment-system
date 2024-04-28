import { Request, Response, NextFunction } from 'express';
import providerService from '@/lib/ProviderService';

const getProviders = async (
  _req: Request,
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

export default getProviders;
