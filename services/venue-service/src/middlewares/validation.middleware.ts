import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body as unknown,
        query: req.query as unknown,
        params: req.params as unknown,
      })) as {
        body: Record<string, unknown>;
        query: Record<string, unknown>;
        params: Record<string, unknown>;
      };
      // Replace req objects with verified type-casted objects

      req.body = parsed.body;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      req.query = parsed.query as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      req.params = parsed.params as any;
      next();
    } catch (error: unknown) {
      const err = error as { errors?: unknown; message?: string };
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: err.errors || err.message,
      });
    }
  };
};
