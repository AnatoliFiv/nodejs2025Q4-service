export interface IBaseRepository<T, TCreate = Omit<T, 'id'>> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(entity: TCreate): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
