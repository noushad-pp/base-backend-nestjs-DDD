import * as EffectBrand from 'effect/Brand';
import * as EffectPredicate from 'effect/Predicate';

import { UuidValueObject } from 'shared-kernel/domain/value-objects/uuid';

type DomainScalar = number | string | boolean;

// Aliasing Branded Scalar as Value Object to hide and decouple from implementation details
export namespace ScalarVO {
  import Brand = EffectBrand.Brand;
  import BrandErrors = Brand.BrandErrors;
  import Constructor = Brand.Constructor;
  import Predicate = EffectPredicate.Predicate;

  export type Type<T extends DomainScalar, B extends string | symbol> = T & Brand<B>;
  export type Unbranded<B> = Brand.Unbranded<B>;

  /**
   * Nominal type constructor for branded scalar value objects, no runtime checks.
   */
  export const nominal = <T extends Brand<any>>(): Constructor<T> & {
    from: (value: Unbranded<T>) => T;
  } => {
    const constructor = EffectBrand.nominal<T>();

    return Object.assign(constructor, {
      from: (value: Unbranded<T>) => constructor(value),
    });
  };

  /**
   * Refined type constructor for branded scalar value objects, with runtime checks.
   * @param refinement Predicate function that checks if the value is valid.
   * @param onFailure Function that returns a list of errors when the value is invalid.
   */
  export const refined = <T extends Brand<any>>(
    refinement: Predicate<Unbranded<T>>,
    onFailure: (a: Unbranded<T>) => BrandErrors
  ): Constructor<T> & {
    from: (value: Unbranded<T>) => T;
  } => {
    const constructor = EffectBrand.refined<T>(refinement, onFailure);

    return Object.assign(constructor, {
      from: (value: Unbranded<T>) => constructor(value),
    });
  };

  /**
   * Refined type constructor for branded scalar value objects, with runtime checks.
   * Provides TRaw type parameter to allow for type-safe conversion from raw values, but still with some type safety.
   *
   * @param refinement Predicate function that checks if the value is valid.
   * @param onFailure Function that returns a list of errors when the value is invalid.
   */
  export const refinedFromRaw = <T extends Brand<any>, TRaw>(
    refinement: Predicate<Unbranded<T> | TRaw>,
    onFailure: (a: Unbranded<T> | TRaw) => BrandErrors
  ): Constructor<T> & {
    fromRaw: (value: TRaw) => T;
    from: (value: TRaw) => T;
  } => {
    const constructor = EffectBrand.refined<T>(refinement, onFailure);

    return Object.assign(constructor, {
      fromRaw: (value: TRaw) => constructor(value as Unbranded<T>),
      from: (value: TRaw) => constructor(value as Unbranded<T>),
    });
  };

  export const error = EffectBrand.error;
  export const errors = EffectBrand.errors;
  export const all = EffectBrand.all;
}

export type DomainValueObject = DomainScalar | UuidValueObject<string>;

/**
 * Compares two Value Objects in DDD, ensuring type-safe equality.
 * It handles branded scalar value objects with strict equality and
 * leverages domain-specific `equals` method for UuidValueObject subclasses,
 * preventing comparison bugs when refactoring Value Objects from scalar to more complex or vice versa.
 */
export function equalsVO<T extends DomainValueObject>(a: T, b: T): boolean {
  // Check for instances of UuidValueObject subclasses
  if (isUuidValueObject(a) && isUuidValueObject(b)) {
    return a.equals(b);
  }

  // Fallback to strict equality on scalar values
  return a === b;
}

function isUuidValueObject<T extends string>(value: unknown): value is UuidValueObject<T> {
  return value instanceof UuidValueObject;
}
