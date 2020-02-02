import { expect, use } from 'chai';
import * as promiseAssertions from 'chai-as-promised';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { CreateMaybeAsync } from '../../src/purify/create-maybe-async.fns';
import { TestClass, TestMethod } from '../test-utilities/directives';

use(promiseAssertions);

@TestClass()
export class CreateMaybeAsyncSpec {
    @TestMethod()
    public async fromPromiseOfMaybe_should_wrapPromiseInMaybeAsync(): Promise<
        void
    > {
        // arrange
        const result = 10;
        const promiseWork = new Promise<Maybe<number>>(res => {
            setTimeout(() => res(Maybe.of(result)), 20);
        });

        // act
        const maybeAsync = CreateMaybeAsync.fromPromiseOfMaybe(promiseWork);

        // assert
        const actual = await maybeAsync.run();
        expect(actual).to.deep.equal(Just(result));
    }

    @TestMethod()
    public async fromPromiseOfNullable_should_wrapPromiseInMaybeAsync(): Promise<
        void
    > {
        // arrange
        const result: undefined = undefined;
        const promiseWork = new Promise<number | undefined>(res => {
            setTimeout(() => res(result), 20);
        });

        // act
        const maybeAsync = CreateMaybeAsync.fromPromiseOfNullable(promiseWork);

        // assert
        const actual = await maybeAsync.run();
        expect(actual).to.equal(Nothing);
    }
}
