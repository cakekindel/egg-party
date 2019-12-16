import { UnitTestSetup } from './unit-test-setup.model';

export interface ISpec<TUnitUnderTest> {
    getUnitTestSetup(): UnitTestSetup<TUnitUnderTest>;
}
