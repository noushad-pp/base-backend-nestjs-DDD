import { randomUUID } from 'crypto';

import { isValidUuid, UuidValueObject } from 'shared-kernel/domain/value-objects/uuid';

// Test subclass of UuidValueObject
class TestUuid extends UuidValueObject<'TestUuid'> {}

describe('Uuid', () => {
  it('should create a valid UUID', () => {
    const uuid = TestUuid.create();

    expect(isValidUuid(uuid.value)).toBe(true);
  });

  it('should throw InvalidUuidError for an invalid UUID string', () => {
    const invalidUuidString = 'invalid-uuid';

    expect(() => TestUuid.from(invalidUuidString)).toThrow(
      'Provided value "invalid-uuid" is not a valid UUID for TestUuid'
    );
  });

  it('should correctly determine UUID equality', () => {
    const uuidString = randomUUID();
    const uuid1 = TestUuid.from(uuidString);
    const uuid2 = TestUuid.from(uuidString);
    const uuid3 = TestUuid.create();

    expect(uuid1.equals(uuid2)).toBeTruthy();
    expect(uuid1.equals(uuid3)).toBeFalsy();
  });

  it('should serialize to JSON correctly', () => {
    const uuidString = randomUUID();
    const uuid = TestUuid.from(uuidString);

    expect(uuid.toJSON()).toBe(uuidString);
    expect(JSON.stringify(uuid)).toBe(JSON.stringify(uuidString));
  });

  // eslint-disable-next-line jest/expect-expect
  it('should not allow AnotherIdType where TestUuid is expected', () => {
    class AnotherIdType extends UuidValueObject<'AnotherIdType'> {}

    const anotherId = AnotherIdType.create();

    function takesTestUuid1(testUuid: TestUuid) {}

    // @ts-expect-error check for Type Safety
    takesTestUuid1(anotherId);
  });
});
