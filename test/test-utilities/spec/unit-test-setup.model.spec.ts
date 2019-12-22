import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { UnitTestSetup } from '../unit-test-setup.model';
import {
    WeatherController,
    WeatherStation,
} from './unit-test-setup.model.test-data';

@suite
export class UnitTestSetupSpec {
    @test()
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

    @test()
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
