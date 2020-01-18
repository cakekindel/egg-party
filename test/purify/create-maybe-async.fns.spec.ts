import { expect, use } from 'chai';
import * as promiseAssertions from 'chai-as-promised';
import { Maybe } from 'purify-ts/Maybe';
import { CreateMaybeAsync } from '../../src/purify/create-maybe-async.fns';
import { TestClass, TestMethod } from '../test-utilities/directives';

use(promiseAssertions);

@TestClass()
export class CreateMaybeAsyncSpec {
    @TestMethod()
    public fromPromiseOfMaybe_should_wrapPromiseInMaybeAsync(): void {
        // arrange
        const result = 10;
        const promiseWork = new Promise<Maybe<number>>(res => {
            setTimeout(() => res(Maybe.of(result)), 20);
        });

        // act
        const maybeAsync = CreateMaybeAsync.fromPromiseOfMaybe(promiseWork);

        // assert
        expect(maybeAsync.run()).to.eventually.equal(result);
    }

    @TestMethod()
    public fromPromiseOfNullable_should_wrapPromiseInMaybeAsync(): void {
        // arrange
        const result: undefined = undefined;
        const promiseWork = new Promise<number | undefined>(res => {
            setTimeout(() => res(result), 20);
        });

        // act
        const maybeAsync = CreateMaybeAsync.fromPromiseOfNullable(promiseWork);

        // assert
        expect(maybeAsync.run()).to.eventually.equal(result);
    }
}
