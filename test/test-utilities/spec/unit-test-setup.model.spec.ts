import { expect } from 'chai';
import { TestClass, TestMethod } from '../directives';
import { UnitTestSetup } from '../unit-test-setup.model';
import {
    WeatherController,
    WeatherStation,
} from './unit-test-setup.model.test-data';

@TestClass()
export class UnitTestSetupSpec {
    @TestMethod()
    public async should_createDependencyMapFromMetadata_when_created(): Promise<
        void
    > {
        // arrange
        const uut = new UnitTestSetup(WeatherStation);

        // act

        // assert
        // https://media.giphy.com/media/12NUbkX6p4xOO4/giphy.gif
        expect(uut.dependencies.getAll().length).to.equal(1);
    }

    @TestMethod()
    public async should_createUutWithDependencies_when_created(): Promise<
        void
    > {
        // arrange
        const uut = new UnitTestSetup(WeatherController);

        // act

        // assert
        expect(uut.unitUnderTest.station).to.not.be.undefined;
    }
}
