import { Type } from '@nestjs/common';
import { expect } from 'chai';
import { DependencySubstituteMap } from '../dependency-map.model';
import { TestClass, TestMethod } from '../directives';
import {
    BabyEmoji,
    EggInPanEmoji,
    Emoji,
    RockClimberEmoji,
} from './dependency-map.model.test-data';

const testDeps: Array<Type<Emoji>> = [
    BabyEmoji,
    EggInPanEmoji,
    RockClimberEmoji,
];

@TestClass()
export class DependencyMapSpec {
    @TestMethod()
    public should_createSeparateSubstitutes_when_created(): void {
        // arrange
        const uut = new DependencySubstituteMap(testDeps);

        // act
        const actual = uut.getAll();

        // assert
        expect(this.allObjectInstancesDifferent(actual)).to.be.true;
    }

    @TestMethod()
    public should_notCreateMultipleSubstitutes_when_createdWithDuplicatedDependency(): void {
        // arrange
        const uut = new DependencySubstituteMap([EggInPanEmoji, EggInPanEmoji]);

        // act
        const actual = uut.getAll();

        // assert
        expect(this.allObjectInstancesDifferent(actual)).to.be.true;
        expect(actual.length).to.equal(1);
    }

    @TestMethod()
    public should_returnSubstitute_when_getMockInvoked(): void {
        // arrange
        const newBabyEmoji = '👼';
        const uut = new DependencySubstituteMap(testDeps);

        // act
        uut.get(BabyEmoji)
            .asString()
            .returns(newBabyEmoji);
        const actual = uut.get(BabyEmoji).asString();

        // assert
        expect(actual).to.equal(newBabyEmoji);
    }

    @TestMethod()
    public should_throw_when_getMockInvokedForUnregisteredMock(): void {
        // arrange
        const uut = new DependencySubstituteMap([EggInPanEmoji]);

        // act
        const getBabyEmojiMockClosure = () => uut.get(BabyEmoji);

        // assert
        expect(getBabyEmojiMockClosure).throws;
    }

    private allObjectInstancesDifferent<TElement>(array: TElement[]): boolean {
        return array.every((item, i) => {
            return array.every((otherItem, oi) => {
                const isSameElement = i === oi;
                const objectsDifferent = item !== otherItem;

                return isSameElement || objectsDifferent;
            });
        });
    }
}
