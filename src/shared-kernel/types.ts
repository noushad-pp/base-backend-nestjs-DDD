export abstract class TaggedClass<T extends string> {
  readonly _tag: T;

  protected constructor() {
    this._tag = this.constructor.name as T;
  }
}

// Utility type that takes an object type and makes the hover overlay more readable.
// @see https://www.totaltypescript.com/concepts/the-prettify-helper
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;

// TODO replace with utility type that cover all edge cases. P.S. copied from FareMill
export type DeepPlainObject<T> = {
  [K in keyof T]: T[K] extends Date ? Date : T[K] extends object ? DeepPlainObject<T[K]> : T[K];
};

export type DeepOptional<T> = {
  [P in keyof T]?: T[P] extends object ? DeepOptional<T[P]> : T[P] | unknown | null;
};

export type ConstructorArgs<T> = T extends new (...args: infer U) => any ? U[0] : never;

export type SerializableValue =
  | string
  | number
  | boolean
  | null
  | Array<SerializableValue>
  | ReadonlyArray<SerializableValue>
  | SerializableObject
  | JsonSerializable;

interface SerializableObject extends Record<string, SerializableValue> {}

export interface JsonSerializable {
  /**
   * @internal Do not call this method directly. Use `JSON.stringify` instead.
   */
  toJSON(): SerializableValue;
}
