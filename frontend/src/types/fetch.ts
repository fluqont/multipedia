import { Nullable } from "../lib/types";

export type StrapiError = FetchError | ZodError;

export interface FetchError {
  error: string;
  errorCode: number;
}

export interface ZodError {
  zodErrors: {
    [key: string]: string[] | undefined;
  };
}

export type InputError = Nullable<string>;
