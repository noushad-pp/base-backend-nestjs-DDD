import { randomUUID } from 'crypto';
import { z } from 'nestjs-zod/z';

import { JsonSerializable, SerializableValue, TaggedClass } from 'shared-kernel/types';

type UuidSubType = UuidValueObject<any>;

/**
 * UuidConstructor<T> is a type that represents a constructor function that takes a string and
 * returns an instance of T, where T extends Uuid<any> (aka UuidSubType)
 */
type UuidConstructor<T extends UuidSubType> = new (uuid: string) => T;

const uuidSchema = z.string().uuid();

export const isValidUuid = (uuid: string): boolean => uuidSchema.safeParse(uuid).success;

export abstract class UuidValueObject<T extends string> extends TaggedClass<T> implements JsonSerializable {
  /**
   * Constructor is supposed to be protected in favor of static factory methods, but it is not supported yet.
   *
   * @deprecated Use `.from(???)` or `.create()` instead.
   */
  public constructor(public readonly value: string) {
    super();
    if (!isValidUuid(value)) {
      throw new InvalidUuidError(value, this._tag);
    }
  }

  /**
   * T extends Uuid<string>: This constrains T to be a subclass of Uuid.
   */
  public static from<T extends UuidSubType>(this: UuidConstructor<T>, uuid: string): T {
    return new this(uuid);
  }

  public static create<T extends UuidSubType>(this: UuidConstructor<T>): T {
    return new this(randomUUID());
  }

  public equals(other: UuidValueObject<T>): boolean {
    return this.value === other.value;
  }

  /**
   * @deprecated Do not call this method directly. Use `JSON.stringify` instead.
   */
  public toJSON(): SerializableValue {
    return this.value;
  }
}

export class InvalidUuidError extends Error {
  constructor(uuid: string, entityName: string) {
    super(`Provided value "${uuid}" is not a valid UUID for ${entityName}`);
  }
}
