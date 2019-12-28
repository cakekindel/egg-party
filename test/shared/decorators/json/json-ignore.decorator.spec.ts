import {
    TestMethod,
    TestClass,
    TestCase,
} from '../../../test-utilities/directives';
import { expect } from 'chai';
import {
    JsonIgnore,
    JsonConfigurable,
} from '../../../../src/shared/decorators/json';

const expectedParsedJson = {
    keepMe: 'keep',
};

@JsonConfigurable()
class ShouldIgnoreProperty {
    public keepMe = 'keep';

    @JsonIgnore()
    public ignoreMe = 'throw away';
}

@JsonConfigurable()
class ShouldIgnoreMultiple {
    public keepMe = 'keep';

    @JsonIgnore()
    public ignoreMe = 'throw away';

    @JsonIgnore()
    public ignoreMeToo = 'bye';
}

@JsonConfigurable()
class ShouldPreserveOriginalToJSON {
    @JsonIgnore()
    public ignoreMe = 'throw away';

    public toJSON(): object {
        return Object.assign(this, { keepMe: 'keep' });
    }
}

@TestClass()
export class JsonIgnoreDecoratorSpec {
    @TestCase(ShouldIgnoreProperty, 'should ignore property')
    @TestCase(ShouldIgnoreMultiple, 'should ignore multiple properties')
    @TestCase(ShouldPreserveOriginalToJSON, 'should preserve original toJSON()')
    public should_ignoreProperties_when_serialized(
        ctor: new () => object
    ): void {
        // arrange
        const obj = new ctor();

        // act
        const jsonString = JSON.stringify(obj);

        // assert
        const parsedJson = JSON.parse(jsonString);
        expect(parsedJson, jsonString).to.deep.equal(expectedParsedJson);
    }
}
