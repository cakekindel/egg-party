import { Type } from '@nestjs/common';
import { DependencySubstituteMap } from './dependency-map.model';

/**
 * Helper class for abstracting the creation of a class and Substitutes for all its dependencies
 */
export class UnitTestSetup<TUnitUnderTest>
{
    public unitUnderTest: TUnitUnderTest;
    public dependencies: DependencySubstituteMap;

    constructor(uutType: Type<TUnitUnderTest>, dependencyTypes: Array<Type<unknown>>)
    {
        this.dependencies = new DependencySubstituteMap(dependencyTypes);
        this.unitUnderTest = new uutType(...this.dependencies.getAll());
    }
}
