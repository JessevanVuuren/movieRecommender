import { ProvidersModel } from "./providers";
import { RegionsModel } from "./regions";

export interface FilterOptions {
  region:string,
  provider: string[],
  genres: string[]
}