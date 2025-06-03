import { Request, Response, NextFunction } from 'express';
import { ProviderCreateSchema } from '@/schemas';
import { IProviderService } from '@/lib/services/interfaces/IProviderService';

export default (providerService: IProviderService) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body
    const parsedBody = ProviderCreateSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors }); // Use 'errors' for consistency
    }

    const { userId } = parsedBody.data;
    // Check if the provider already exists using the injected service
    const existingProvider = await providerService.checkExistingProvider(userId);

    if (existingProvider) {
      return res
        .status(400)
        .json({ message: 'Healthcare Provider already exists!' });
    }

    // Create the provider using the injected service
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
