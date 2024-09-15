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
    const messageInput = ref<HTMLTextAreaElement | null>(null);
    let socket: WebSocket | null = null;

    const getChatMessages = () => {
      if (!messages.value[props.chatUser]) {
        messages.value[props.chatUser] = [];
      }
      return messages.value[props.chatUser];
    };

    const connectToWebSocket = () => {
      socket = new WebSocket('ws://localhost:2567');

      socket.onopen = () => {
        console.log('WebSocket connection opened');
        socket.send(JSON.stringify({ type: 'join', chatUser: props.chatUser }));
      };

      socket.onmessage = (event) => {
        const message: Message = JSON.parse(event.data);
        if (message && (message.author === props.currentUser || message.author === props.chatUser)) {
          const chatMessages = getChatMessages();
          chatMessages.push(message);
          messages.value = { ...messages.value, [props.chatUser]: chatMessages };
        }
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
    };

    onMounted(() => {
      connectToWebSocket();
      nextTick(() => {
        if (messageInput.value) {
          autoResize();
        }
      });
    });

    watch(() => props.chatUser, (newChatUser) => {
      if (socket) {
        socket.send(JSON.stringify({ type: 'leave', chatUser: props.chatUser }));
        socket.send(JSON.stringify({ type: 'join', chatUser: newChatUser }));
      }
    });

    const sendMessage = () => {
      if (newMessage.value.trim() !== '' && socket) {
        const message = {
          text: newMessage.value,
          author: props.currentUser,
        };
        socket.send(JSON.stringify({ type: 'message', message }));
        newMessage.value = ''; // Очистка поля ввода
        autoResize();
      }
    };

    const deleteMessage = (index: number) => {
      getChatMessages().splice(index, 1);
    };

    const editMessage = (message: Message) => {
      message.isEditing = true;
      editedMessage.value = message.text;
    };

    const confirmEditMessage = (message: Message) => {
      message.text = editedMessage.value;
      message.isEditing = false;
      if (socket) {
        socket.send(JSON.stringify({ type: 'edit', message }));
      }
    };

    const autoResize = () => {
      if (messageInput.value) {
        messageInput.value.style.height = 'auto';
        messageInput.value.style.height = `${messageInput.value.scrollHeight}px`;
      }
    };

    onBeforeUnmount(() => {
      if (socket) {
        socket.close();
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
