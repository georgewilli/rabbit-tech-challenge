export class ProductFilters {
  categories?: string[];
  areas?: string[];
  sortBy?: string; // Can be 'name', 'createdAt', etc.
  sortOrder?: 'asc' | 'desc'; // Sorting order
  page?: number; // Pagination
  pageSize?: number; // Pagination
}
