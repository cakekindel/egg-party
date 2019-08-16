import { Injectable } from '@nestjs/common';
import { SlackBlockMessage as BlockMessage } from '../../../shared/models/slack/messages';
import {
    SlackMessageTextCompositionType as TextType
} from '../../../shared/models/slack/messages/blocks/composition/text/slack-message-text-composition-type.enum';
import {
    SlackMessageTextComposition as Text
} from '../../../shared/models/slack/messages/blocks/composition/text/slack-message-text-composition.model';
import { SlackMessageButtonElement as Button } from '../../../shared/models/slack/messages/blocks/element/button';
import { SlackMessageActionsBlock as Actions } from '../../../shared/models/slack/messages/blocks/layout/actions';
import { SlackMessageDividerBlock as Divider } from '../../../shared/models/slack/messages/blocks/layout/divider';
import { SlackMessageSectionBlock as Section } from '../../../shared/models/slack/messages/blocks/layout/section';

// tslint:disable:max-line-length
@Injectable()
export class SlackMessageBuilderService
{
    public testGiveEggsResponse(mentions: string[], eggCount: number): BlockMessage
    {
        return new BlockMessage([], `You gave ${mentions.join(', ')} each ${eggCount} egg(s)!`);
    }

    public newUserWelcomeMessage(userId: string): BlockMessage
    {
        return new BlockMessage([
            new Section(new Text(TextType.Markdown, `*Hi! Welcome to the Egg Party!* :wave:`)),
            new Section(new Text(TextType.Markdown, `Egg Party is a new way to give thanks to your team and have fun doing it!`)),
            new Section(new Text(TextType.Markdown, `All you have to do is mention a teammate and throw some eggs in there! You can include a message if you'd like, but it's not required.`)),
            new Section(new Text(TextType.Markdown, `When you first start using Egg Party, you can give out *5 eggs a day*, but you can raise that number by taking good care of chicks that hatch from eggs you're given!`)),
            new Section(new Text(TextType.Markdown, `Think "Tamagotchi", but less copyright-infringy.`)),
            new Section(new Text(TextType.Markdown, `For example:`)),
            new Section(new Text(TextType.Markdown, `> <@${userId}> Thanks for using Egg Party! :egg::egg::egg:`)),
            new Section(new Text(TextType.Markdown, `There's a lot more to Egg Party, but now you're ready to sling some yolk!`)),
            new Divider(),
            new Section(new Text(TextType.Markdown, `Would you like to know what you can do with your newly-harnessed fowl superpower?`)),
            new Actions([
                new Button('tell_me_more', new Text(TextType.Plaintext, 'I\'m sold! Tell me all about it')),
                new Button('tell_me_a_little_more', new Text(TextType.Plaintext, 'I\'m listening...')),
            ]),
        ]);
    }
}
