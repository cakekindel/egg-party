import Substitute, { SubstituteOf } from '@fluffy-spoon/substitute';
import { Type } from '@nestjs/common';

export class DependencySubstituteMap
{
    private _unsafeMap = new Map<Type<unknown>, SubstituteOf<any>>();

    constructor(dependencyTypes: Array<Type<unknown>>)
    {
        dependencyTypes.forEach(type => this.add(type));
    }

    public getAll(): Array<SubstituteOf<unknown>>
    {
        return Array.from(this._unsafeMap.values());
    }

    public get<TDep>(dependencyType: Type<TDep>): SubstituteOf<TDep>
    {
        const substitute = this._unsafeMap.get(dependencyType);
        if (substitute === undefined)
            throw new Error(`DependencySubstituteMap: Substitute for ${dependencyType.name} is not registered.`);

        return substitute;
    }

    private add(dependencyType: Type<unknown>): void
    {
        const substitute = Substitute.for<unknown>();
        this._unsafeMap.set(dependencyType, substitute);
    }
}
