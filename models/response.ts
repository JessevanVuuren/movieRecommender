import { ShowModel } from "./show";

export interface ResponseModel {
  page: number;
  results: ShowModel[];
  total_pages: number;
  total_results: number;
}
