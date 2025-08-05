# API Patterns Documentation

## Overview

This document describes the reusable API patterns implemented to eliminate code duplication across endpoint services.

## Reusable Types

### Core API Types (`src/types/api.ts`)

The following types are designed to be reused across all API endpoints:

#### `IPaginationMeta`
Standard pagination metadata used by all list endpoints:
```typescript
export interface IPaginationMeta {
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
```

#### `IApiResponse<T>`
Generic API response wrapper:
```typescript
export interface IApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

#### `IListResponse<T>`
Paginated list response that extends `IPaginationMeta`:
```typescript
export interface IListResponse<T> extends IPaginationMeta {
  payload: T[];
}
```

#### `IListQuery`
Common query parameters for list endpoints:
```typescript
export interface IListQuery {
  filter?: string;
  fields?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
  status?: string;
  select?: string;
}
```

## Entity-Specific Type Patterns

### For each entity (e.g., Bots, Leads), create:

1. **Base Entity Interface**
```typescript
export interface IBot {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

2. **Request Interfaces**
```typescript
export interface ICreateBotRequest extends ICreateRequest<IBot> {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface IUpdateBotRequest extends IUpdateRequest<IBot> {
  name?: string;
  description?: string;
  isActive?: boolean;
}
```

3. **Response Type Aliases**
```typescript
export type IListBotsResponse = IListResponse<IBot>;
export type IListOneBotResponse = IApiResponse<IBot>;
export type ICreateBotResponse = IApiResponse<IBot>;
export type IUpdateBotResponse = IApiResponse<IBot>;
export interface IDeleteBotResponse extends IApiResponse<void> {
  data: void;
}
```

4. **Query Type Alias**
```typescript
export type IBotListQuery = IListQuery;
```

## Service Implementation Pattern

### Base Service Factory (`src/services/api/baseService.ts`)

The `createBaseService` factory provides a generic CRUD implementation:

```typescript
export function createBaseService<T, CreateRequest, UpdateRequest>(
  endpoint: string
) {
  return {
    list(query: IListQuery): AxiosPromise<T> { /* ... */ },
    listOne(id: string): AxiosPromise<T> { /* ... */ },
    update(id: string, payload: UpdateRequest): AxiosPromise<T> { /* ... */ },
    create(payload: CreateRequest): AxiosPromise<T> { /* ... */ },
    delete(id: string): AxiosPromise<T> { /* ... */ },
  };
}
```

### Entity Service Implementation

Each entity service uses the base factory with proper typing:

```typescript
// Create typed service using the base factory
const baseService = createBaseService<
  IListBotsResponse | IListOneBotResponse | ICreateBotResponse | IUpdateBotResponse | IDeleteBotResponse,
  ICreateBotRequest,
  IUpdateBotRequest
>("bots");

export default {
  list(query: IBotListQuery): AxiosPromise<IListBotsResponse> {
    return baseService.list(query) as AxiosPromise<IListBotsResponse>;
  },
  // ... other methods
};
```

## Benefits

1. **DRY Principle**: Eliminates code duplication across services
2. **Type Safety**: Maintains full TypeScript type safety
3. **Consistency**: Ensures all endpoints follow the same patterns
4. **Maintainability**: Changes to common patterns only need to be made in one place
5. **Scalability**: Easy to add new entities following the same pattern

## Usage Example

To create a new entity service:

1. Define entity types in `src/types/entityName.ts`
2. Create service file in `src/services/api/entityName.ts`
3. Use the base service factory with proper typing
4. Export the service with entity-specific method signatures

This pattern ensures consistency and reduces maintenance overhead across the entire API layer. 