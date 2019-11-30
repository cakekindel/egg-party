// tslint:disable: max-classes-per-file
export abstract class Emoji
{
    public abstract asString(): string;
}

export class BabyEmoji extends Emoji
{
    public asString(): string { return '👶'; }
}

export class EggInPanEmoji extends Emoji
{
    public asString(): string { return '🍳'; }
}

export class RockClimberEmoji extends Emoji
{
    public asString(): string { return '🧗‍♂️'; }
}

export class EmojiDaemon
{
    constructor(
        baby: BabyEmoji,
        eggPan: EggInPanEmoji,
        climber: RockClimberEmoji,
    ) {
        baby.asString();
        eggPan.asString();
        climber.asString();
    }
}
