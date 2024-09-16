<template>
  <div class="user-selection">
    <h2>Select a User</h2>
    <input v-model="searchTerm" placeholder="Search users..." class="search-input" />
    <ul>
      <li v-for="(user, index) in filteredUsers" :key="index" @click="selectUser(user)">
        <div class="user-info">
          <img :src="getAvatarUrl(user)" alt="User Avatar" class="user-avatar" />
          <span class="user-name">{{ user }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  props: {
    users: Array as () => string[],
  },
  emits: ['select-user'],
  setup(props, { emit }) {
    const searchTerm = ref('');

    const filteredUsers = computed(() => {
      return props.users.filter(user =>
          user.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    const selectUser = (user: string) => {
      emit('select-user', user);
    };

    const getAvatarUrl = (username: string) => {
      return `https://i.pravatar.cc/150?img=${username}`;
    };

    return {
      searchTerm,
      filteredUsers,
      selectUser,
      getAvatarUrl,
    };
  },
});
</script>

<style scoped>
.user-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #e2e2e2, #ffffff);
  padding: 0 20px;
  font-family: 'Roboto', sans-serif;
}

h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.search-input {
  width: 100%;
  max-width: 360px;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #dfe3e8;
  border-radius: 12px;
  outline: none;
  font-size: 16px;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.search-input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
}

ul {
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 360px;
}

li {
  cursor: pointer;
  padding: 14px 20px;
  margin: 8px 0;
  background-color: #ffffff;
  border: 1px solid #dfe3e8;
  border-radius: 12px;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
}

li:hover {
  background-color: #e0f7fa;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

li:active {
  background-color: #b2ebf2;
}

.user-info {
  display: flex;
  align-items: center;
  width: 100%;
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
