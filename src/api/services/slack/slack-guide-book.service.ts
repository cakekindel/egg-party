// tslint:disable:max-line-length

import { Injectable } from '@nestjs/common';

import { SlackInteractionId } from '../../../shared/enums';
import {
    GuideBookPageGroup,
    GuideBookPageId,
    IGuideBookPage,
} from '../../../shared/models/guide-book';

// block
import { SlackBlockMessage as BlockMessage } from '../../../shared/models/slack/messages';

// layout blocks
import { ISlackMessageLayoutBlock as ILayoutBlock } from '../../../shared/models/slack/messages/blocks/layout';
import { SlackMessageActionsBlock as Actions } from '../../../shared/models/slack/messages/blocks/layout/actions';
import { SlackMessageContextBlock as Context } from '../../../shared/models/slack/messages/blocks/layout/context';
import { SlackMessageDividerBlock as Divider } from '../../../shared/models/slack/messages/blocks/layout/divider';
import { SlackMessageSectionBlock as Section } from '../../../shared/models/slack/messages/blocks/layout/section';

// composition objects
import { SlackMessageOptionComposition as Option } from '../../../shared/models/slack/messages/blocks/composition/option/slack-message-option-composition.model';
import { SlackMessageOptionGroupComposition as OptionGroup } from '../../../shared/models/slack/messages/blocks/composition/option/slack-message-option-group-composition.model';
import { SlackMessageTextCompositionType as TextType } from '../../../shared/models/slack/messages/blocks/composition/text/slack-message-text-composition-type.enum';
import { SlackMessageTextComposition as Text } from '../../../shared/models/slack/messages/blocks/composition/text/slack-message-text-composition.model';

// block elements
import { SlackMessageButtonElement as Button } from '../../../shared/models/slack/messages/blocks/element/button';
import { SlackMessageStaticSelectElement as StaticSelect } from '../../../shared/models/slack/messages/blocks/element/select/static';

import { SlackUser } from '../../../db/entities';
import { SlackApiService } from './slack-api.service';

@Injectable()
export class SlackGuideBookService {
    constructor(private slackApi: SlackApiService) {}

    private readonly pages: IGuideBookPage[] = [
        {
            id: GuideBookPageId.Welcome,
            group: GuideBookPageGroup.None,
            title: 'Welcome Page',
            shortTitle: 'Welcome Page',
        },
        // Learn About...
        {
            id: GuideBookPageId.LearnAboutGivingEggs,
            group: GuideBookPageGroup.LearnAbout,
            title: 'How to Give Eggs',
            shortTitle: 'Giving Eggs :egg:',
        },
        {
            id: GuideBookPageId.LearnAboutChickens,
            group: GuideBookPageGroup.LearnAbout,
            title: 'Chickens & Daily Eggs',
            shortTitle: 'Chickens :chicken:',
        },
        // {
        //     id: GuideBookPageId.LearnAboutChicks,
        //     group: GuideBookPageGroup.LearnAbout,
        //     title: 'Getting & Raising Chicks',
        //     shortTitle: 'Chicks :hatching_chick:'
        // },
        // {
        //     id: GuideBookPageId.LearnAboutBreeds,
        //     group: GuideBookPageGroup.LearnAbout,
        //     title: 'Chicken Breeds',
        //     shortTitle: 'Breeds :rooster:'
        // },
        {
            id: GuideBookPageId.LearnAboutCommands,
            group: GuideBookPageGroup.LearnAbout,
            title: 'Chat Commands',
            shortTitle: 'Commands :pager:',
        },

        // Chicken Breed Field Guide
        // {
        //     id: GuideBookPageId.BreedGuideDelawareHen,
        //     group: GuideBookPageGroup.ChickenBreedFieldGuide,
        //     title: 'Delaware Hen',
        //     shortTitle: ':chicken: Delaware'
        // },
    ];

    public async send(
        user: SlackUser,
        page: GuideBookPageId = GuideBookPageId.Welcome
    ): Promise<void> {
        const guideBook = this.build(
            user.slackUserId,
            user.team?.botUserId ?? '',
            page
        );

        return this.slackApi.sendDirectMessage(
            user.team?.oauthToken ?? '',
            user.slackUserId,
            guideBook
        );
    }

    public build(
        userId: string,
        botUserId: string,
        pageId: GuideBookPageId = GuideBookPageId.Welcome
    ): BlockMessage {
        const jumpToPageSelect = this.getGuideBookSelectNav();

        const message = new BlockMessage(
            [
                new Divider(),
                new Section(
                    new Text(TextType.Markdown, `*:book:   Guide Book*`),
                    undefined,
                    jumpToPageSelect
                ),
                new Divider(),
                ...this.buildGuideBookContent(userId, botUserId, pageId),
                new Divider(),
            ],
            'Open Slack to see the Egg Party Guidebook'
        );

        const buttonNav = this.getGuideBookButtonNav(pageId);
        if (buttonNav) {
            message.blocks.push(buttonNav);
        }

        return message;
    }

    private getGuideBookSelectNav(): StaticSelect {
        return new StaticSelect(
            SlackInteractionId.GuideBookJumpToPage,
            new Text(TextType.Plaintext, `Jump to Page`, false),
            undefined,
            [
                // Learn About...
                new OptionGroup(
                    new Text(
                        TextType.Plaintext,
                        `:scroll: Learn About...`,
                        true
                    ),
                    this.pages
                        .filter(p => p.group === GuideBookPageGroup.LearnAbout)
                        .map(
                            p =>
                                new Option(
                                    new Text(TextType.Plaintext, p.title),
                                    p.id
                                )
                        )
                ),
                // Chicken Breed Field Guide
                // new OptionGroup(
                //     new Text(TextType.Plaintext, `:chicken: Chicken Breed Field Guide`, true),
                //     this.pages.filter(p => p.group === GuideBookPageGroup.ChickenBreedFieldGuide)
                //               .map(p => new Option(new Text(TextType.Plaintext, p.title), p.id)),
                // )
            ]
        );
    }

    private getGuideBookButtonNav(
        pageId: GuideBookPageId
    ): Actions | undefined {
        const pageIdx = this.pages.findIndex(p => p.id === pageId);
        const prevPage: IGuideBookPage | undefined = this.pages[pageIdx - 1];
        const nextPage: IGuideBookPage | undefined = this.pages[pageIdx + 1];

        const navButtons = [
            prevPage &&
                new Button(
                    SlackInteractionId.GuideBookJumpToPage + '_back',
                    new Text(
                        TextType.Plaintext,
                        'Back: ' + prevPage.shortTitle,
                        true
                    ),
                    undefined,
                    prevPage.id
                ),
            nextPage &&
                new Button(
                    SlackInteractionId.GuideBookJumpToPage + '_next',
                    new Text(
                        TextType.Plaintext,
                        'Next: ' + nextPage.shortTitle,
                        true
                    ),
                    undefined,
                    nextPage.id
                ),
        ].filter(b => b);

        return (navButtons.length && new Actions(navButtons)) || undefined;
    }

    private buildGuideBookContent(
        userId: string,
        botUserId: string,
        pageId: GuideBookPageId
    ): ILayoutBlock[] {
        switch (pageId) {
            case GuideBookPageId.Welcome:
                return this.buildWelcomePage();
            case GuideBookPageId.LearnAboutGivingEggs:
                return this.buildGivingEggsPage(userId, botUserId);
            case GuideBookPageId.LearnAboutChickens:
                return this.buildChickensPage();
            case GuideBookPageId.LearnAboutChicks:
                return this.buildChicksPage();
            case GuideBookPageId.LearnAboutBreeds:
                return this.buildBreedsPage();
            case GuideBookPageId.LearnAboutCommands:
                return this.guideBookPageCommands();
            default:
                return [];
        }
    }

    private buildWelcomePage(): ILayoutBlock[] {
        return [
            new Section(
                new Text(
                    TextType.Markdown,
                    `*Hi! Welcome to the Egg Party!* :wave:`
                )
            ),
            new Context([
                new Text(
                    TextType.Markdown,
                    `_Created by <https://github.com/cakekindel|Orion Kindel>_`
                ),
            ]),
            new Section(new Text(TextType.Markdown, ` `)),
            new Section(
                new Text(
                    TextType.Markdown,
                    `Egg Party is a new way to give thanks to your team and have fun doing it! Give your teammates eggs to show appreciation, and raise the eggs that hatch!`
                )
            ),
            new Section(
                new Text(
                    TextType.Markdown,
                    `Use the "Jump to Page" menu above to learn more, or play it by ear and learn as you go!`
                )
            ),
            new Context([
                new Text(
                    TextType.Markdown,
                    `> _"A great friend is he who shares an egg with a teammate that did a good job resolving the outage from their 5PM Friday deploy."_ - Plato, 413 A.D. *ᵖʳᵒᵇᵃᵇˡʸ*`
                ),
            ]),
        ];
    }

    private buildGivingEggsPage(
        userId: string,
        botUserId: string
    ): ILayoutBlock[] {
        return [
            new Section(new Text(TextType.Markdown, `*How to Give Eggs*`)),
            new Section(new Text(TextType.Markdown, ` `)),
            new Section(
                new Text(
                    TextType.Markdown,
                    `First, invite me to the channel where the magic happens.`
                )
            ),
            new Context([
                new Text(
                    TextType.Markdown,
                    `_*Pro Tip*: You can invite me to a channel super quickly by sending "/invite <@${botUserId}>"_`
                ),
            ]),
            new Section(
                new Text(
                    TextType.Markdown,
                    `Then, to give an egg to a teammate, send a message mentioning them with some \`:egg:\` emojis! Starting out, you can give *5 eggs a day*.`
                )
            ),
            new Context([
                new Text(
                    TextType.Markdown,
                    `_*Example*: Great work this week <@${userId}>! :egg::egg::egg:_`
                ),
            ]),
            new Section(
                new Text(
                    TextType.Markdown,
                    `You can also give eggs by adding an :egg: reaction! This is good if you want to keep clutter down, or just really appreciate a message someone sends.`
                )
            ),
        ];
    }

    private buildChickensPage(): ILayoutBlock[] {
        return [
            new Section(new Text(TextType.Markdown, `*Chickens & Daily Eggs*`)),
            new Section(new Text(TextType.Markdown, ` `)),
            new Section(
                new Text(
                    TextType.Markdown,
                    `When you first start using Egg Party you have *5 Chickens*. Chickens lay 1 egg at midnight every day, so you can give out *5 eggs a day*!`
                )
            ),
            new Context([
                new Text(
                    TextType.Markdown,
                    `_Chickens won't lay another Daily Egg unless the previous egg is given away, so don't even think about skimping on egg-giving._`
                ),
            ]),
            // new Section(new Text(TextType.Markdown, `There's a small chance that one of your daily eggs will hatch into a chick that will grow into another chicken, so keep your eyes peeled for a tiny fluff in need of love!`)),
            // new Context([new Text(TextType.Markdown, `_*Pro Tip*: You can increase your chances of a daily egg hatching by giving eggs often. It's a win-win!_`)]),
            new Section(new Text(TextType.Markdown, ` `)),
            new Section(
                new Text(
                    TextType.Markdown,
                    `Would you like to name your chickens?`
                ),
                undefined,
                new Button(
                    SlackInteractionId.ManageChickens,
                    new Text(TextType.Plaintext, `Sure, I'd love to name them!`)
                )
            ),
            new Context([
                new Text(
                    TextType.Markdown,
                    `_Nobody will see these names other than you, so feel free to get creative!_`
                ),
            ]),
        ];
    }

    private buildChicksPage(): ILayoutBlock[] {
        return [
            new Section(
                new Text(TextType.Markdown, `*Getting & Raising Chicks*`)
            ),
            new Section(new Text(TextType.Markdown, ` `)),
            new Section(
                new Text(
                    TextType.Markdown,
                    `As mentioned in *Chickens & Daily Eggs*, when a Daily Egg is laid, there's a small chance it will hatch into a chick.`
                )
            ),
            new Section(
                new Text(
                    TextType.Markdown,
                    `Daily Eggs don't get replaced unless they're given away, so be sure to give all your Daily Eggs away to maximize your chances of hatching!`
                )
            ),
            new Section(
                new Text(
                    TextType.Markdown,
                    `When a Chick does hatch, you can feed it once a day. You have to feed it 3 times for it to grow up into a Chicken.`
                )
            ),
            new Section(
                new Text(
                    TextType.Markdown,
                    `The food you give Chicks is very important, as it will determine what Breed it will be as a Chicken! For example, corn :corn: will yield a Delaware Hen, the basic Chicken Breed.`
                )
            ),
        ];
    }

    private buildBreedsPage(): ILayoutBlock[] {
        return [
            new Section(new Text(TextType.Markdown, `*Chicken Breeds*`)),
            new Section(new Text(TextType.Markdown, ` `)),
            new Section(
                new Text(
                    TextType.Markdown,
                    `Chickens can come in several different *Breeds*, and each one has a unique Breed Ability!`
                )
            ),
            new Section(
                new Text(
                    TextType.Markdown,
                    `For example: the Delaware Hen lays 1 egg a day, and the Leghorn Rooster doesn't lay eggs but increase the hatch chance of the other Chickens' eggs.`
                )
            ),
            new Section(
                new Text(
                    TextType.Markdown,
                    `It's up to you and your team to discover how to raise chicks into the different breeds and discover their abilities.`
                )
            ),
            new Section(
                new Text(
                    TextType.Markdown,
                    `As you get more breeds, your Guide Book's *Chicken Breed Field Guide* section will have information on that breed's ability and how to raise them!`
                )
            ),
        ];
    }

    private guideBookPageCommands(): ILayoutBlock[] {
        return [
            new Section(new Text(TextType.Markdown, `*Commands*`)),
            new Section(new Text(TextType.Markdown, ` `)),
            new Section(
                new Text(
                    TextType.Markdown,
                    `There are a few commands to help you on your yolky journey. To use them, simply send them here in this Direct Message.`
                )
            ),
            new Context([
                new Text(TextType.Markdown, '`help`'),
                new Text(TextType.Markdown, `_Resend the welcome message_`),
            ]),
            new Context([
                new Text(TextType.Markdown, '`chickens`'),
                new Text(TextType.Markdown, `_View & rename your chickens_`),
            ]),
            new Context([
                new Text(TextType.Markdown, '`leaderboard`'),
                new Text(
                    TextType.Markdown,
                    `_View your team's Egg Party stats, and see how you stack up!_`
                ),
            ]),
            new Context([
                new Text(TextType.Markdown, '`profile`'),
                new Text(TextType.Markdown, `_View your own Egg Party stats_`),
            ]),
        ];
    }
}
