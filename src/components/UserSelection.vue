<template>
  <div class="user-selection">
    <h2>Select a User</h2>
    <input v-model="searchTerm" placeholder="Search users..." class="search-input" />
    <ul>
      <li v-for="(user, index) in filteredUsers" :key="index" @click="selectUser(user)">
        {{ user }}
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
      const result = props.users.filter(user =>
          user.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
      console.log('Filtered users:', result);
      return result;
    });

    const selectUser = (user: string) => {
      emit('select-user', user);
    };

    return {
      searchTerm,
      filteredUsers,
      selectUser,
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
  background-color: #f5f7fa;
  padding: 0 20px;
}

h2 {
  margin-bottom: 20px;
  color: #444;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.search-input {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #dfe3e8;
  border-radius: 8px;
  outline: none;
}

ul {
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 300px;
}

li {
  cursor: pointer;
  padding: 12px 20px;
  margin: 8px 0;
  background-color: #ffffff;
  border: 1px solid #dfe3e8;
  border-radius: 8px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

li:hover {
  background-color: #e6f7ff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
