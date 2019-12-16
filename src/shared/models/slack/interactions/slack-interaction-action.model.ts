export interface ISlackInteractionAction {
    type: 'button' | 'static_select';
    action_id: string;
    block_id: string;

    value?: string;
    selected_option?: { value: string };
}
