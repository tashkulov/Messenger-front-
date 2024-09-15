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
    const users = ['Alice', 'Bob', 'Charlie'];
    const currentUser = ref<string | null>(null);
    const selectedChatUser = ref<string | null>(null);

    const availableUsers = computed(() => {
      return users.filter(user => user !== currentUser.value);
    });

    const chatUsers = computed(() => {
      return availableUsers.value.filter(user => user !== selectedChatUser.value);
    });

    const setUser = (user: string) => {
      currentUser.value = user;
    };

    const setChatUser = (chatUser: string) => {
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
}

.chat-container {
  display: flex;
  width: 100%;
}
</style>
