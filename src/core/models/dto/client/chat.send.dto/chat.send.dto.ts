export class ChatSendDto {
    public constructor(init?: Partial<ChatSendDto>) {
        Object.assign(this, init);
    }
    
    type: string;
    content: string;
}
