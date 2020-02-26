import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { Either, Left, Nothing, Right } from 'purify-ts';
import { then } from 'ramda';
import { wrapWithPromise } from '../../../shared/functions/promise';
import {
    matchSlackEvent,
    SlackEventMatcher,
} from '../../../shared/models/slack/events/pattern-matching';
import { SlackApiService } from '../../services/slack';
import {
    SlackMessageHandler,
    SlackReactionHandler,
} from '../../services/slack/handlers';
import { ExpressRequest } from '../../utility/http/request';
import {
    ExpressResponse,
    respondOk,
    respondUnauthorized,
} from '../../utility/http/response';

@Controller('v1/slack/events')
export class SlackEventsController {
    constructor(
        private api: SlackApiService,
        private messageHandler: SlackMessageHandler,
        private reactionHandler: SlackReactionHandler
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    public async receiveEvent(
        @Req() req: ExpressRequest,
        @Res() res: ExpressResponse
    ): Promise<ExpressResponse> {
        const authentic = this.api.verifySlackRequest(req);

        return Either.of<typeof Nothing, typeof Nothing>(Nothing)
            .chain(() => (authentic ? Right(Nothing) : Left(Nothing)))
            .map<SlackEventMatcher<Promise<void | string>>>(() => ({
                challenge: e => wrapWithPromise(e.challenge),
                message: e => this.messageHandler.handleMessage(e),
                reaction: e => this.reactionHandler.handleReaction(e),
                _: Promise.resolve,
            }))
            .map(matcher => matchSlackEvent(req.body, matcher))
            .map(then(body => respondOk(res, body)))
            .mapLeft(() => respondUnauthorized(res))
            .extract();
    }
}
