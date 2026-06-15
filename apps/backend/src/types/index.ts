import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
    app_metadata?: Record<string, unknown>;
  };
}
