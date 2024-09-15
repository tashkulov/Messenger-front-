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
          <span class="user-icon"></span>
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

    return {
      searchQuery,
      filteredChatUsers,
      selectChat,
    };
  },
});
</script>

<style scoped>
.chat-list {
  width: 250px;
  border-right: 1px solid #dfe3e8;
  height: 100vh;
  overflow-y: auto;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

.search-bar {
  padding: 10px;
  border-bottom: 1px solid #dfe3e8;
  background-color: #ffffff;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #dfe3e8;
  border-radius: 5px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

li {
  cursor: pointer;
  padding: 15px 20px;
  transition: background-color 0.3s;
  border-bottom: 1px solid #e0e6ed;
  display: flex;
  align-items: center;
}

li:hover {
  background-color: #eef3f8;
}

li:active {
  background-color: #d0d7e2;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-icon {
  width: 8px;
  height: 8px;
  background-color: green;
  border-radius: 50%;
  margin-right: 10px;
}

.user-name {
  font-size: 16px;
}
</style>
