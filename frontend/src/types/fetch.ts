export type StrapiError = FetchError | ZodError;

export interface FetchError {
  error: string;
  errorCode: number;
}

interface ZodError {
  zodErrors: {
    [key: string]: string[];
  };
}
