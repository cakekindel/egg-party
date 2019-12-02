import { Injectable } from '@nestjs/common';

import { Chicken } from '../../../db/entities';
import { SlackInteractionId } from '../../../shared/enums';
import { SlackBlockMessage as BlockMessage } from '../../../shared/models/slack/messages';
import {
    SlackMessageOptionComposition as Option
} from '../../../shared/models/slack/messages/blocks/composition/option/slack-message-option-composition.model';
import {
    SlackMessageOptionGroupComposition as OptionGroup
} from '../../../shared/models/slack/messages/blocks/composition/option/slack-message-option-group-composition.model';
import {
    SlackMessageTextCompositionType as TextType
} from '../../../shared/models/slack/messages/blocks/composition/text/slack-message-text-composition-type.enum';
import {
    SlackMessageTextComposition as Text
} from '../../../shared/models/slack/messages/blocks/composition/text/slack-message-text-composition.model';
import { SlackMessageButtonElement as Button } from '../../../shared/models/slack/messages/blocks/element/button';
import { SlackMessageStaticSelectElement as StaticSelect } from '../../../shared/models/slack/messages/blocks/element/select/static';
import { ISlackMessageLayoutBlock as ILayoutBlock } from '../../../shared/models/slack/messages/blocks/layout';
import { SlackMessageActionsBlock as Actions } from '../../../shared/models/slack/messages/blocks/layout/actions';
import { SlackMessageContextBlock as Context } from '../../../shared/models/slack/messages/blocks/layout/context';
import { SlackMessageDividerBlock as Divider } from '../../../shared/models/slack/messages/blocks/layout/divider';
import { SlackMessageSectionBlock as Section } from '../../../shared/models/slack/messages/blocks/layout/section';
import { SlackGuideBookService } from './slack-guide-book.service';

// tslint:disable:max-line-length
// TODO: Remove this in favor of custom message objects.
@Injectable()
export class SlackMessageBuilderService
{
    constructor(private guideBookBuilder: SlackGuideBookService) { }

    public guideBook(userId: string, botUserId: string): BlockMessage
    {
        return this.guideBookBuilder.build(userId, botUserId);
    }

    public triedToGiveTooManyEggs(): BlockMessage
    {
        return new BlockMessage([], 'You can\'t give that many eggs!');
    }

    public outOfEggs(): BlockMessage
    {
        return new BlockMessage([], 'You\'re out of eggs!');
    }

    public testGiveEggsResponse(mentions: string[], eggCount: number): BlockMessage
    {
        return new BlockMessage([], `You gave ${mentions.join(', ')} each ${eggCount} egg(s)!`);
    }

    public manageChickens(chickens: Chicken[]): BlockMessage
    {
        const message = new BlockMessage([
            new Section(new Text(TextType.Markdown, `*Your Chickens*`)),
            new Divider(),
        ]);

        for (const chicken of chickens)
        {
            const renameButton = new Button(
                SlackInteractionId.RenameChicken,
                new Text(TextType.Plaintext, `Rename`),
                undefined,
                chicken.id.toString()
            );

            const chickenSection = new Section(new Text(TextType.Markdown, `:chicken: *${chicken.name}*`), undefined, renameButton);
            message.blocks.push(chickenSection);
        }

        return message;
    }

    public renameChicken(chicken: Chicken): BlockMessage
    {
        return new BlockMessage([
            new Section(new Text(TextType.Markdown, `No problem! To rename :chicken: *${chicken.name}*, just reply with the new name.`))
        ]);
    }

    public chickenRenamed(oldName: string, newName: string): BlockMessage
    {
        const notes = [
            `*${newName}* just rolls off the tongue, don't you think?`,
            `*${newName}* has a nice ring to it!`,
            `*${newName}* is kinda fierce, don't you think?! Like ${oldName} would just sit by while ${newName} robbed a bank`,
            `Look, it's your chicken, but I'm not sure how I feel about *${newName}*. I can't place it, but something doesn't sit right with me about it.`,
            `*${newName}* could be the next 007 :gun::chicken:`,
            `I love it!`,
            `So regal!`,
            `Someone call the Fire Department because that name is lit! _ᶦᵐ ˢᵒʳʳʸ_`,
            `Try saying it 5 times fast: "${newName} ${newName} ${newName} ${this.garbleText(newName)} ${this.garbleText(newName)}" - man I suck at tongue twisters`
        ];

        return new BlockMessage([
            new Section(new Text(TextType.Markdown, `:chicken: *${oldName}* is now :chicken: *${newName}*! ${this.getRandomEntry(notes)}`))
        ]);
    }

    private garbleText(text: string): string
    {
        const words = text.split(' ');
        const garbWords = words.map(this.garbleWord);

        return garbWords.join(' ');
    }

    private garbleWord(word: string): string
    {
        const chars = word.split('');
        const garbled: string[] = [];

        for (let i = 0; i < chars.length; i++)
        {
            if (i === 0 || i === chars.length - 1)
            {
                garbled.push(chars[i]);
            }
            else
            {
                garbled.push(this.getRandomEntry(chars));
            }
        }

        return garbled.join('');
    }

    private getRandomEntry<TItem>(arr: TItem[]): TItem
    {
        const i = Math.floor(Math.random() * arr.length);
        return arr[i];
    }
}
