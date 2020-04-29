import { _, when, strike } from '@matchbook/ts';
import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { Either, Left, Maybe, Nothing, Right } from 'purify-ts';
import { then } from 'ramda';
import { SlackTeam } from '../../../business/view-models';
import { SlackDmCommand } from '../../../shared/enums';
import { wrapWithPromise } from '../../../shared/functions/promise';
import { SlackNamedIdentifier } from '../../../shared/models/slack/api/slack-named-identifier.trait';
import { ConversationType } from '../../../shared/models/slack/conversations';
import {
    ISlackEvent,
    ISlackEventChallenge, ISlackEventMessagePosted, ISlackEventWrapper,
} from '../../../shared/models/slack/events';
import {
    eventIsChallenge,
    eventIsMessage,
    eventIsReaction,
    eventIsWrappedMessage,
    eventIsWrappedReaction,
} from '../../../shared/models/slack/events/type-guards';
import { Brand } from '../../../types/brand';
import {SlackUserContext} from '../../../types/slack/user';
import {SlackEscapedText} from '../../../types/slack/brands';
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

        if (!authentic) return respondUnauthorized(res);

        return strike<ISlackEvent, ExpressResponse>(
            req.body as ISlackEvent,
            when(eventIsChallenge, (e) => respondOk(res, e.challenge)),
            when(eventIsWrappedMessage, handleMessageAsync),
            when(eventIsWrappedReaction, e =>
                this.reactionHandler.handleReaction(e).then(() => '')
            ),
            _('')
        );

        return respondOk(res, responseText);
    }
}



// tslint:disable-next-line:interface-over-type-literal


// IO




function actOnCommandAsync(
    text: SlackEscapedText,
    command: SlackDmCommand
): Promise<Either<CommandErr, undefined>>;
