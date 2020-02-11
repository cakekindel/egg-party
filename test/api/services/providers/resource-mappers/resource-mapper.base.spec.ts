import { expect } from 'chai';
import { Just, Maybe, Nothing } from 'purify-ts';
import { fake } from 'sinon';
import { ResourceMapperBase } from '../../../../../src/business/providers/resource-mappers';
import { TestCase, TestClass } from '../../../../test-utilities/directives';

interface ITestViewModel {
    shouldMap: number;
    shouldCopy: boolean;
}

interface ITestEntity {
    shouldMap2: number;
    shouldCopy: boolean;
}

class TestMapper extends ResourceMapperBase<ITestViewModel, ITestEntity> {
    public mapToEntity(vm: ITestViewModel): ITestEntity {
        return {
            shouldMap2: vm.shouldMap,
            shouldCopy: vm.shouldCopy,
        };
    }
    public mapToViewModel(entity: ITestEntity): ITestViewModel {
        return {
            shouldCopy: entity.shouldCopy,
            shouldMap: entity.shouldMap2,
        };
    }
}

type MaybeMapperKey = keyof Pick<
    TestMapper,
    'mapMaybeToViewModel' | 'mapMaybeToEntity'
>;

type ArrayMapperKey = keyof Pick<
    TestMapper,
    'mapArrayToEntities' | 'mapArrayToViewModels'
>;

type ImplMapperKey = keyof Pick<TestMapper, 'mapToViewModel' | 'mapToEntity'>;

@TestClass()
export class ResourceMapperBaseSpec {
    @TestCase('mapMaybeToViewModel' as MaybeMapperKey)
    @TestCase('mapMaybeToEntity' as MaybeMapperKey)
    public async mapMaybe_shouldReturn_nothing_when_inputNothing(
        functionUnderTest: MaybeMapperKey
    ): Promise<void> {
        // arrange
        const uut = new TestMapper();

        // act
        const actual = uut[functionUnderTest](Nothing);

        // assert
        expect(actual).to.equal(Nothing);
    }

    @TestCase({
        fnUnderTest: 'mapMaybeToEntity' as MaybeMapperKey,
        fnToFake: 'mapToEntity' as ImplMapperKey,
    })
    @TestCase({
        fnUnderTest: 'mapMaybeToViewModel' as MaybeMapperKey,
        fnToFake: 'mapToViewModel' as ImplMapperKey,
    })
    public async mapMaybe_should_callThroughImpl_when_inputNotNothing(testCase: {
        fnUnderTest: MaybeMapperKey;
        fnToFake: keyof TestMapper;
    }): Promise<void> {
        // arrange
        const uut = new TestMapper();
        const functionUnderTest: (m: Maybe<unknown>) => Maybe<unknown> = m =>
            uut[testCase.fnUnderTest](m as typeof Nothing);

        const input = Just({ input: true });
        const mapped = { input: false };
        const implFake = fake(() => mapped);
        uut[testCase.fnToFake] = implFake;

        // act
        const actual = functionUnderTest(
            input as typeof Nothing
        ).extract() as typeof mapped;

        // assert
        expect(actual === mapped).to.be.true;
    }

    @TestCase({
        fnUnderTest: 'mapArrayToEntities' as ArrayMapperKey,
        fnToFake: 'mapToEntity' as ImplMapperKey,
    })
    public async mapArray_should_callThroughImpl(testCase: {
        fnUnderTest: ArrayMapperKey;
        fnToFake: ImplMapperKey;
    }): Promise<void> {
        // arrange
        const uut = new TestMapper();
        const input: ITestViewModel[] & ITestEntity[] = [
            { shouldCopy: false, shouldMap: 0, shouldMap2: 2 },
        ];

        const mapped = {};
        const implFake = fake(() => mapped);
        uut[testCase.fnToFake] = implFake;

        const expected = [mapped];

        // act
        const actual = uut[testCase.fnUnderTest](input);

        // assert
        implFake.calledOnceWith(input[0]);
        expect(actual).to.deep.equal(expected);
    }
}
