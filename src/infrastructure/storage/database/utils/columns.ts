import { Column, ColumnOptions } from 'typeorm';

export const CountryCodeColumn = (options?: ColumnOptions) => Column({ ...options, type: 'char', length: 2 });

export const UuidColumn = (options: ColumnOptions = {}) => Column({ ...options, type: 'uuid' });

export const JsonColumn = (options?: ColumnOptions) => Column({ ...options, type: 'json' });
