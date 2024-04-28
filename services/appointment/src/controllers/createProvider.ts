import { Request, Response, NextFunction } from 'express';
import providerService from '@/lib/ProviderService';
import { ProviderCreateSchema } from '@/schemas';

const createProvider = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body
    const parsedBody = ProviderCreateSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({ message: parsedBody.error.errors });
    }

    const { userId } = parsedBody.data;
    const existingProvider = await providerService.checkExistingProvider(userId);

    if (existingProvider) {
      return res
        .status(400)
        .json({ message: 'Healthcare Provider already exists!' });
    }

    const healthcareProvider = await providerService.createProvider(
      parsedBody.data
    );

    return res
      .status(201)
      .json({
        message: 'Healthcare Provider created successfully!',
        healthcareProvider,
      });
  } catch (err) {
    next(err);
  }
};

export default createProvider;
