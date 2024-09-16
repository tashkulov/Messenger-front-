<template>
  <div class="chat-header">
    <div class="header-avatar">
      <img :src="avatarUrl" alt="User Avatar" />
    </div>
    <div class="header-info">
      <span class="header-username">{{ chatUser }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: {
    chatUser: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const avatarUrl = computed(() => `https://i.pravatar.cc/150?img=${props.chatUser}`);

    return {
      avatarUrl,
    };
  },
});
</script>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background-color: #f5f7fa;
}

.header-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.header-info {
  font-size: 18px;
  font-weight: bold;
}
</style>
