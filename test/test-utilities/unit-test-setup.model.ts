import { Type } from '@nestjs/common';
import { DependencySubstituteMap } from './dependency-map.model';

/**
 * Helper class for abstracting the creation of a class and Substitutes for all its dependencies
 */
export class UnitTestSetup<TUnitUnderTest> {
    public unitUnderTest: TUnitUnderTest;
    public dependencies: DependencySubstituteMap;

    constructor(uutType: Type<TUnitUnderTest>) {
        const dependencyTypes = UnitTestSetup.getDependencyTypesFromMetadata(
            uutType
        );

        this.dependencies = new DependencySubstituteMap(dependencyTypes);
        this.unitUnderTest = new uutType(...this.dependencies.getAll());
    }

    private static getDependencyTypesFromMetadata(
        type: Type<unknown>
    ): Array<Type<unknown>> {
        return Reflect.getMetadata('design:paramtypes', type) || [];
    }
}
