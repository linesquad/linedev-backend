declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

export interface JWTPayload {
  id: string;
}
