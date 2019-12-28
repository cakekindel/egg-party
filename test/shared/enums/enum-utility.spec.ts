import { TestClass, TestCase } from '../../test-utilities/directives';
import { EnumUtility } from '../../../src/shared/enums';
import { expect } from 'chai';

enum InitializedEnum {
    StringValue = 'boo!',
    NumericValue = 2,
}

enum AutoAssignedEnum {
    Foo,
    Bar,
    Baz,
}

interface ITestCase {
    enum: object;
    value: string;
    expected: string | number | undefined;
}

@TestClass()
export class EnumUtilitySpec {
    @TestCase({
        enum: InitializedEnum,
        value: 'boo!',
        expected: InitializedEnum.StringValue,
    })
    @TestCase({
        enum: InitializedEnum,
        value: 2,
        expected: InitializedEnum.NumericValue,
    })
    @TestCase({
        enum: AutoAssignedEnum,
        value: 2,
        expected: AutoAssignedEnum.Baz,
    })
    @TestCase({
        enum: InitializedEnum,
        value: 'not here!',
        expected: undefined,
    })
    public async should_parseEnumValue(testCase: ITestCase): Promise<void> {
        // arrange

        // act
        const actual = EnumUtility.Parse(testCase.enum, testCase.value);

        // assert
        expect(actual).to.equal(testCase.expected);
    }
}
