import { TestClass, TestMethod } from '../../../test-utilities/directives';
import Substitute, { Arg, SubstituteOf } from '@fluffy-spoon/substitute';
import { Response } from 'express';
import { sendRedirectResponse } from '../../../../src/api/functions/response';
import { HttpStatus } from '@nestjs/common';

@TestClass()
export class SendRedirectResponseSpec {
    @TestMethod()
    public async should_setStatusMovedPermanently(): Promise<void> {
        // arrange
        const resp = this.mockResponse();
        const url = 'https://www.cheese.com';

        // act
        sendRedirectResponse(resp, url);

        // assert
        resp.received().status(HttpStatus.MOVED_PERMANENTLY);
    }

    @TestMethod()
    public async should_setLocationHeaderToUrl(): Promise<void> {
        // arrange
        const resp = this.mockResponse();
        const url = 'https://www.cheese.com';

        // act
        sendRedirectResponse(resp, url);

        // assert
        resp.received().header('Location', url);
    }

    @TestMethod()
    public async should_send(): Promise<void> {
        // arrange
        const resp = this.mockResponse();
        const url = 'https://www.cheese.com';

        // act
        sendRedirectResponse(resp, url);

        // assert
        resp.received().send();
    }

    private mockResponse(): SubstituteOf<Response> {
        const resp = Substitute.for<Response>();

        resp.status(Arg.any()).returns(resp);
        resp.header(Arg.any(), Arg.any()).returns(resp);
        resp.send().returns(resp);

        return resp;
    }
}
