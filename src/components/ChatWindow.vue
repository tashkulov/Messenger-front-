<template>
  <div class="chat-window">
    <ChatHeader :chatUser="chatUser" />
    <div class="messages">
      <Message
          v-for="(message, index) in getChatMessages()"
          :key="index"
          :message="message"
          :currentUser="currentUser"
          :isActive="activeMessageIndex === index"
          :isEditing="message.isEditing"
          @edit-message="editMessage(message)"
          @delete-message="deleteMessage(index)"
          @confirm-edit-message="confirmEditMessage(message)"
      />
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
import ChatHeader from '../shared/ChatHeader.vue';
import Message from '../shared/Message.vue';
import { ChatService } from '../services/chatService';

interface Message {
  text: string;
  author: string;
  isEditing?: boolean;
  timestamp: number;
}

export default defineComponent({
  components: {
    ChatHeader,
    Message,
  },
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
    const chatService = new ChatService('ws://localhost:2567');
    const messageInput = ref<HTMLTextAreaElement | null>(null);

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
      await chatService.joinRoom('chat');
      chatService.onMessage((message: Message) => {
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
      if (newMessage.value.trim() !== '') {
        const message = {
          text: newMessage.value,
          author: props.currentUser,
          timestamp: Date.now(),
        };
        chatService.sendMessage(message);
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
      chatService.leaveRoom();
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
