<template>
  <div class="chat-list">
    <div class="search-bar">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Search users..."
      />
    </div>
    <ul>
      <li v-for="(chatUser, index) in filteredChatUsers" :key="index" @click="selectChat(chatUser)">
        <div class="user-info">
          <img :src="getAvatarUrl(chatUser)" alt="User Avatar" class="user-avatar" />
          <span class="user-name">{{ chatUser }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  props: {
    chatUsers: {
      type: Array as () => string[],
      required: true,
    },
  },
  emits: ['select-chat'],
  setup(props, { emit }) {
    const searchQuery = ref('');

    const filteredChatUsers = computed(() => {
      return props.chatUsers.filter(user =>
          user.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const selectChat = (chatUser: string) => {
      emit('select-chat', chatUser);
    };

    const getAvatarUrl = (username: string) => {
      return `https://i.pravatar.cc/150?img=${username}`;
    };

    return {
      searchQuery,
      filteredChatUsers,
      selectChat,
      getAvatarUrl,
    };
  },
});
</script>

<style scoped>
.chat-list {
  width: 300px;
  border-right: 2px solid #e2e8f0;
  height: 100vh;
  overflow-y: auto;
  background: linear-gradient(180deg, #f9f9f9 0%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  font-family: 'Arial', sans-serif;
}

.search-bar {
  padding: 12px;
  border-bottom: 2px solid #e2e8f0;
  background-color: #ffffff;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #dfe3e8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

li {
  cursor: pointer;
  padding: 12px 20px;
  transition: background-color 0.3s, transform 0.2s;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  border-radius: 8px;
}

li:hover {
  background-color: #f0f4f8;
  transform: translateX(5px);
}

li:active {
  background-color: #e2e8f0;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.user-name {
  font-size: 18px;
  font-weight: 500;
  color: #2d3748;
}
</style>
