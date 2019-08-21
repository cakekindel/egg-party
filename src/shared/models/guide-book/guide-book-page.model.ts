import { GuideBookPageGroup } from './guide-book-page-group.enum';
import { GuideBookPageId } from './guide-book-page-id.enum';

export interface IGuideBookPage
{
    id: GuideBookPageId;
    group: GuideBookPageGroup;
    title: string;
    shortTitle: string;
}
