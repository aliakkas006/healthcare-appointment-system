import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const setCorrelationId = (req: Request, res: Response, next: NextFunction) => {
  const key = 'x-correlation-id';
  const correlationId = req.headers[key] || uuidv4();

  req.headers[key] = correlationId;
  res.set(key, correlationId);

  next();
};

export default setCorrelationId;