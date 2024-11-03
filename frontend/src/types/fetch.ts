export type StrapiError = FetchError | ZodError;

interface FetchError {
  error: string;
  errorCode: number;
}

interface ZodError {
  zodErrors: {
    [key: string]: string;
  };
}
