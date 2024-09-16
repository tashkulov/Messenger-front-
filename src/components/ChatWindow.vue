<template>
  <div class="chat-window">
    <div class="messages">
      <div
          v-for="(message, index) in getChatMessages()"
          :key="index"
          :class="['message', message.author === currentUser ? 'sent' : 'received']"
      >
        <span v-if="message.isEditing">
          <input
              v-model="editedMessage"
              @keydown.enter="confirmEditMessage(message)"
              placeholder="Edit your message..."
          />
        </span>
        <span v-else>
          {{ message.text }}
          <button v-if="message.author === currentUser" @click="editMessage(message)">
            Edit
          </button>
          <button v-if="message.author === currentUser" @click="deleteMessage(index)">
            Delete
          </button>
        </span>
      </div>
    </div>
    <textarea
        v-model="newMessage"
        @keydown.enter="sendMessage"
        @input="autoResize"
        placeholder="Type your message..."
        ref="messageInput"
    ></textarea>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount, defineComponent, watch, nextTick } from 'vue';
import { Client, Room } from 'colyseus.js';

interface Message {
  text: string;
  author: string;
  isEditing?: boolean;
}

export default defineComponent({
  props: {
    currentUser: {
      type: String,
      required: true,
    },
    chatUser: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const messages = ref<Record<string, Message[]>>({});
    const newMessage = ref('');
    const editedMessage = ref('');
    let room: Room | null = null;
    const messageInput = ref<HTMLTextAreaElement | null>(null);

    const client = new Client('ws://localhost:2567');

    // Load chat messages from localStorage
    const loadMessagesFromStorage = () => {
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        messages.value = JSON.parse(savedMessages);
      }
    };

    // Save chat messages to localStorage
    const saveMessagesToStorage = () => {
      localStorage.setItem('chatMessages', JSON.stringify(messages.value));
    };

    // Create or load messages for each chat
    const getChatMessages = () => {
      if (!messages.value[props.chatUser]) {
        messages.value[props.chatUser] = [];
      }
      return messages.value[props.chatUser];
    };

    const joinRoom = async (chatUser: string) => {
      if (room) {
        await room.leave();
      }
      room = await client.joinOrCreate('chat');
      room.onMessage('message', (message: Message) => {
        if (message.author === props.currentUser || message.author === chatUser) {
          getChatMessages().push(message);
          saveMessagesToStorage(); // Save messages whenever new ones are received
        }
      });
    };

    onMounted(() => {
      loadMessagesFromStorage(); // Load messages from localStorage on mount
      joinRoom(props.chatUser);
      nextTick(() => {
        if (messageInput.value) {
          autoResize();
        }
      });
    });

    watch(() => props.chatUser, (newChatUser) => {
      joinRoom(newChatUser);
    });

    const sendMessage = () => {
      if (newMessage.value.trim() !== '' && room) {
        const message = {
          text: newMessage.value,
          author: props.currentUser,
        };
        room.send('message', message);
        newMessage.value = '';  // Очистка поля ввода
        autoResize();
      }
    };

    const deleteMessage = (index: number) => {
      getChatMessages().splice(index, 1);
      saveMessagesToStorage(); // Save messages after deletion
    };

    const editMessage = (message: Message) => {
      message.isEditing = true;
      editedMessage.value = message.text;
    };

    const confirmEditMessage = (message: Message) => {
      message.text = editedMessage.value;
      message.isEditing = false;
      saveMessagesToStorage(); // Save messages after editing
    };

    const autoResize = () => {
      if (messageInput.value) {
        messageInput.value.style.height = 'auto';
        messageInput.value.style.height = `${messageInput.value.scrollHeight}px`;
      }
    };

    onBeforeUnmount(() => {
      if (room) {
        room.leave();
      }
    });

    return {
      getChatMessages,
      newMessage,
      sendMessage,
      deleteMessage,
      editMessage,
      confirmEditMessage,
      autoResize,
      messageInput,
      editedMessage,
    };
  },
});
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #dfe3e8;
}

.message {
  padding: 10px 15px;
  margin: 8px 0;
  border-radius: 8px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  max-width: 60%;
}

.sent {
  background-color: #d1e7dd;
  margin-left: auto;
  text-align: right;
  border-top-right-radius: 0;
}

.received {
  background-color: #e6f7ff;
  margin-right: auto;
  text-align: left;
  border-top-left-radius: 0;
}

textarea {
  border: none;
  padding: 15px;
  margin: 10px;
  border-top: 1px solid #dfe3e8;
  border-radius: 5px;
  outline: none;
  font-size: 16px;
  resize: none;
  overflow: hidden;
  min-height: 40px;
  max-height: 150px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  width: calc(100% - 30px);
}

button {
  margin-left: 10px;
  background-color: transparent;
  border: none;
  color: #007bff;
  cursor: pointer;
}

button:hover {
  text-decoration: underline;
}
</style>