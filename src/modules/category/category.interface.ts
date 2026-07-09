export interface ICategoryFilterRequest {
  searchTerm?: string;
}

export interface ICategoryResponse {
  id: string;
  name: string;
  createdAt: Date;
}