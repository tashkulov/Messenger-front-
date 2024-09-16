import { Client, Room } from 'colyseus.js';

interface Message {
    text: string;
    author: string;
    isEditing?: boolean;
    timestamp: number;
}

export class ChatService {
    private client: Client;
    private room: Room | null = null;

    constructor(serverUrl: string) {
        this.client = new Client(serverUrl);
    }

    async joinRoom(roomName: string): Promise<void> {
        if (this.room) {
            await this.room.leave();
        }
        this.room = await this.client.joinOrCreate(roomName);
    }

    onMessage(callback: (message: Message) => void): void {
        if (this.room) {
            this.room.onMessage('message', callback);
        }
    }

    sendMessage(message: Message): void {
        if (this.room) {
            this.room.send('message', message);
        }
    }

    leaveRoom(): void {
        if (this.room) {
            this.room.leave();
            this.room = null;
        }
    }
}
