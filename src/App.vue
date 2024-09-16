<template>
  <div class="app">
    <UserSelection
        v-if="!currentUser"
        :users="availableUsers"
        @select-user="setUser"
    />
    <div v-else class="chat-container">
      <ChatList
          :chatUsers="chatUsers"
          @select-chat="setChatUser"
      />
      <ChatWindow
          v-if="selectedChatUser"
          :currentUser="currentUser"
          :chatUser="selectedChatUser"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from 'vue';
import UserSelection from './components/UserSelection.vue';
import ChatList from './components/ChatList.vue';
import ChatWindow from './components/ChatWindow.vue';

export default defineComponent({
  components: {
    UserSelection,
    ChatList,
    ChatWindow,
  },
  setup() {
    const users = ['Sara', 'Angelina', 'Charlie'];
    const currentUser = ref<string | null>(null);
    const selectedChatUser = ref<string | null>(null);

    const availableUsers = computed(() => {
      return users.filter(user => user !== currentUser.value);
    });

    const chatUsers = computed(() => {
      return availableUsers.value.filter(user => user !== selectedChatUser.value);
    });

    const setUser = (user: string) => {
      console.log('User selected:', user);
      currentUser.value = user;
    };

    const setChatUser = (chatUser: string) => {
      console.log('Chat user selected:', chatUser);
      selectedChatUser.value = chatUser;
    };

    return {
      users,
      currentUser,
      availableUsers,
      chatUsers,
      selectedChatUser,
      setUser,
      setChatUser,
    };
  },
});
</script>

<style scoped>
.app {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Roboto', sans-serif;
}

.chat-container {
  display: flex;
  flex: 1;
  height: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.user-selection {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 20px;
}

.chat-list {
  flex: 1;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  padding: 10px;
  border-radius: 8px 0 0 8px;
}

.chat-window {
  flex: 3;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 0 8px 8px 0;
}

@media (max-width: 768px) {
  .chat-container {
    flex-direction: column;
  }

  .chat-list {
    border-right: none;
    border-bottom: 1px solid #ddd;
    border-radius: 8px 8px 0 0;
  }

  .chat-window {
    border-radius: 0 0 8px 8px;
  }
}
</style>
