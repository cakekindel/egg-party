export interface ISlackConversation {
    id: string;
    name: string;

    is_channel: boolean;
    is_group: boolean;
    is_im: boolean;
    is_private: boolean;
    is_mpim: boolean;

    is_archived: boolean;
    is_general: boolean;

    created: number;
    creator: string;
    is_member: boolean;
}
