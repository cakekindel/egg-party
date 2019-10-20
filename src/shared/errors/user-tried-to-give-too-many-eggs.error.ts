export class ErrorUserTriedToGiveTooManyEggs extends Error
{
    constructor(eggsUserCanGiveCount: number, eggsGivenCount: number)
    {
        super();
    }
}
