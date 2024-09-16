<template>
  <div :class="['message', message.author === currentUser ? 'sent' : 'received']">
    <div v-if="isEditing" class="edit-container">
      <input
          v-model="editedMessage"
          @keydown.enter="confirmEditMessage"
          placeholder="Edit your message..."
          class="edit-input"
      />
    </div>
    <div v-else class="message-content">
      <div class="message-header">
        <div class="avatar">
          <img :src="avatarUrl" alt="Avatar" />
        </div>
        <button @click.stop="toggleMenu" class="action-btn">
          <span class="dot">⋮</span>
        </button>
        <div v-if="showMenu" class="menu">
          <button @click.stop="editMessage" class="menu-item edit">
            <span class="icon">✎</span>Edit
          </button>
          <button @click.stop="deleteMessage" class="menu-item delete">
            <span class="icon">🗑️</span>Delete
          </button>
        </div>
      </div>
      <div class="message-text-container">
        <span class="message-text">{{ message.text }}</span>
        <span class="message-time">{{ formatTime(message.timestamp) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

export default defineComponent({
  props: {
    message: {
      type: Object as () => Message,
      required: true,
    },
    currentUser: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const editedMessage = ref(props.message.text);
    const showMenu = ref(false);

    const avatarUrl = computed(() => `https://i.pravatar.cc/150?img=${props.message.author}`);

    const formatTime = (timestamp: number) => {
      const date = new Date(timestamp);
      return `${date.getHours()}:${date.getMinutes()}`;
    };

    const toggleMenu = () => {
      showMenu.value = !showMenu.value;
    };

    const editMessage = () => {
      emit('edit-message');
      showMenu.value = false;
    };

    const deleteMessage = () => {
      emit('delete-message');
      showMenu.value = false;
    };

    const confirmEditMessage = () => {
      emit('confirm-edit-message', editedMessage.value);
    };

    return {
      editedMessage,
      avatarUrl,
      formatTime,
      toggleMenu,
      showMenu,
      editMessage,
      deleteMessage,
      confirmEditMessage,
    };
  },
});
</script>

<style scoped>
.message {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 12px 18px;
  margin: 8px 0;
  border-radius: 12px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  max-width: 70%;
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
  flex-direction: column;
  width: 100%;
}

.message-header {
  display: flex;
  align-items: center;
  position: relative;
}

.avatar {
  margin-right: 12px;
}

.avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.action-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 20px;
  margin-left: auto;
  position: relative;
}

.dot {
  display: inline-block;
}

.menu {
  position: absolute;
  top: 35px;
  right: 0;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
  width: 130px;
  display: flex;
  flex-direction: column;
  padding: 0;
  transition: opacity 0.3s, transform 0.3s;
}
.menu-item {
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  cursor: pointer;
  background: #ffffff;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: background 0.3s, color 0.3s, transform 0.3s;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.menu-item:hover {
  background: #f0f0f0;
  color: #333;
  transform: scale(1.02);
}

.menu-item:active {
  background: #e0e0e0;
  transform: scale(0.98);
}

.menu-item .icon {
  margin-right: 10px;
  font-size: 16px;
  transition: color 0.3s;
}

.menu-item:hover .icon {
  color: #007bff;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #f5f7fa;
}

.menu-item.edit {
  color: #007bff;
}

.menu-item.delete {
  color: #dc3545;
}

.menu-item.edit:hover {
  background: #e2e6ff;
}

.menu-item.delete:hover {
  background: #f8d7da;
}

.menu-item .icon {
  margin-right: 10px;
  font-size: 16px;
}

.edit-container {
  margin-top: 10px;
}

.edit-input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
  width: 90%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.edit-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
}

.message-text-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.message-text {
  font-size: 16px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
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
