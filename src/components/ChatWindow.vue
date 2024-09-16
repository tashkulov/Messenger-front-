<template>
  <div class="chat-window">
    <div class="messages">
      <div
          v-for="(message, index) in getChatMessages()"
          :key="index"
          :class="['message', message.author === currentUser ? 'sent' : 'received']"
          @click="setActiveMessage(index)"
      >
        <div v-if="activeMessageIndex === index && message.isEditing" class="edit-container">
          <input
              v-model="editedMessage"
              @keydown.enter="confirmEditMessage(message)"
              placeholder="Edit your message..."
              class="edit-input"
          />
        </div>
        <div v-else class="message-content">
          <div class="avatar">
            <img :src="getAvatarUrl(message.author)" alt="Avatar" />
          </div>
          <div class="message-text-container">
            <span class="message-text">{{ message.text }}</span>
            <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            <div v-if="activeMessageIndex === index" class="message-actions">
              <button v-if="message.author === currentUser" @click.stop="editMessage(message)" class="action-btn">
                Edit
              </button>
              <button v-if="message.author === currentUser" @click.stop="deleteMessage(index)" class="action-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <textarea
        v-model="newMessage"
        @keydown.enter="sendMessage"
        @input="autoResize"
        placeholder="Type your message..."
        ref="messageInput"
        class="message-input"
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
  timestamp: number;
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
    const activeMessageIndex = ref<number | null>(null);
    let room: Room | null = null;
    const messageInput = ref<HTMLTextAreaElement | null>(null);

    const client = new Client('ws://localhost:2567');

    const loadMessagesFromStorage = () => {
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        messages.value = JSON.parse(savedMessages);
      }
    };

    const saveMessagesToStorage = () => {
      localStorage.setItem('chatMessages', JSON.stringify(messages.value));
    };

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
          saveMessagesToStorage();
        }
      });
    };

    onMounted(() => {
      loadMessagesFromStorage();
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
          timestamp: Date.now(),
        };
        room.send('message', message);
        newMessage.value = '';
        autoResize();
      }
    };

    const deleteMessage = (index: number) => {
      getChatMessages().splice(index, 1);
      saveMessagesToStorage();
      activeMessageIndex.value = null;
    };

    const editMessage = (message: Message) => {
      message.isEditing = true;
      editedMessage.value = message.text;
    };

    const confirmEditMessage = (message: Message) => {
      message.text = editedMessage.value;
      message.isEditing = false;
      saveMessagesToStorage();
      activeMessageIndex.value = null;
    };

    const autoResize = () => {
      if (messageInput.value) {
        messageInput.value.style.height = 'auto';
        messageInput.value.style.height = `${messageInput.value.scrollHeight}px`;
      }
    };

    const formatTime = (timestamp: number) => {
      const date = new Date(timestamp);
      return `${date.getHours()}:${date.getMinutes()}`;
    };

    const getAvatarUrl = (username: string) => {
      return `https://i.pravatar.cc/150?img=${username}`;
    };

    const setActiveMessage = (index: number) => {
      activeMessageIndex.value = activeMessageIndex.value === index ? null : index;
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
      formatTime,
      getAvatarUrl,
      setActiveMessage,
      activeMessageIndex,
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
  border-radius: 8px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ddd;
}

.message {
  display: flex;
  align-items: flex-start;
  padding: 12px 18px;
  margin: 8px 0;
  border-radius: 12px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  max-width: 70%; /* Reduced width */
  width: fit-content;
  animation: fadeIn 0.3s ease-out;
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

.message-content {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.avatar {
  margin-right: 12px;
}

.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.message-text-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.message-text {
  font-size: 16px;
  line-height: 1.4;
  word-wrap: break-word; /* Ensure long words break */
}

.message-time {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.message-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
}

.action-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  margin-left: 8px;
  font-size: 14px;
}

.action-btn:hover {
  text-decoration: underline;
}

.edit-container {
  display: flex;
  justify-content: flex-end;
}

.edit-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #dfe3e8;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
}

.message-input {
  border: none;
  padding: 15px;
  margin: 10px;
  border-top: 1px solid #dfe3e8;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
  resize: none;
  overflow: hidden;
  min-height: 40px;
  max-height: 150px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  width: calc(100% - 30px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
