import { TestClass, TestMethod } from '../../../test-utilities/directives';
import Substitute from '@fluffy-spoon/substitute';
import { Response } from 'express';
import { sendRedirectResponse } from '../../../../src/api/functions/response';
import { HttpStatus } from '@nestjs/common';

@TestClass()
export class SendRedirectResponseSpec {
    @TestMethod()
    public async should_setStatusMovedPermanently(): Promise<void> {
        // arrange
        const resp = Substitute.for<Response>();
        const url = 'https://www.cheese.com';

        // act
        sendRedirectResponse(resp, url);

        // assert
        resp.received().status(HttpStatus.MOVED_PERMANENTLY);
    }

    @TestMethod()
    public async should_setLocationHeaderToUrl(): Promise<void> {
        // arrange
        const resp = Substitute.for<Response>();
        const url = 'https://www.cheese.com';

        // act
        sendRedirectResponse(resp, url);

        // assert
        resp.received().header('Location', url);
    }

    @TestMethod()
    public async should_send(): Promise<void> {
        // arrange
        const resp = Substitute.for<Response>();
        const url = 'https://www.cheese.com';

        // act
        sendRedirectResponse(resp, url);

        // assert
        resp.received().send();
    }
}
