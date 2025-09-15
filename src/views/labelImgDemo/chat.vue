<template>
  <div class="chat-container" :class="{ 'chat-open': isOpen }">
    <div class="chat-button" @click="toggleChat">
      <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
      <!-- <i class="icon-chat"></i> -->
      <img src="http://192.168.80.32:8888/客服.png" width="60%" alt="" />
    </div>

    <div class="chat-window">
      <div class="chat-header">
        <h3>在线客服</h3>
        <div class="header-actions">
          <button @click="toggleHistory" class="history-btn">
            {{ showHistory ? "返回当前对话" : "历史记录" }}
          </button>
          <button @click="toggleChat" class="close-btn">×</button>
        </div>
      </div>

      <div class="chat-body">
        <!-- 历史记录面板 -->
        <div v-if="showHistory" class="history-panel">
          <div class="history-list">
            <div
              v-for="(session, index) in currentSession.messages"
              :key="index"
              class="history-item"
              :class="{ active: currentSessionIndex === index }"
            >
              <div class="history-time">
                {{ formatTime(session.time) }}
              </div>
              <img
                style="width: 100%"
                v-if="session.type === 'image'"
                :src="session.content"
              />
              <span v-else-if="session.type === 'emoji'" class="emoji-message">
                {{ session.content }}
              </span>
              <div class="history-preview">
                {{ session.content || "无消息" }}
              </div>
            </div>
          </div>
        </div>

        <!-- 当前聊天面板 -->
        <div v-else class="message-panel">
          <div class="messages-wrapper" ref="messagesContainer">
            <div class="messages">
              <div
                v-for="(message, index) in currentSession.messages"
                :key="index"
                class="message"
                :class="{
                  user: message.sender === 'user',
                  ai: message.sender === 'ai',
                  image: message.type === 'image',
                  emoji: message.type === 'emoji',
                }"
              >
                <div class="message-content">
                  <img
                    v-if="message.type === 'image'"
                    :src="message.content"
                    @click="previewImage(message.content)"
                  />
                  <span
                    v-else-if="message.type === 'emoji'"
                    class="emoji-message"
                  >
                    {{ message.content }}
                  </span>
                  <span v-else>{{ message.content }}</span>
                </div>
                <div class="message-time">{{ formatTime(message.time) }}</div>
              </div>
            </div>
          </div>

          <div class="input-area">
            <div class="toolbar">
              <button @click="toggleEmojiPicker" class="tool-btn">
                <i class="icon-emoji">😊</i>
              </button>
              <button @click="triggerFileInput" class="tool-btn">
                <i class="icon-image">📷</i>
              </button>
              <input
                type="file"
                ref="fileInput"
                @change="handleImageUpload"
                accept="image/*"
                style="display: none"
              />
            </div>

            <div v-if="showEmojiPicker" class="emoji-picker">
              <span
                v-for="emoji in emojis"
                :key="emoji"
                @click="selectEmoji(emoji)"
                >{{ emoji }}</span
              >
            </div>

            <textarea
              v-model="inputMessage"
              @keyup.enter="sendMessage"
              placeholder="输入消息..."
              ref="textInput"
            ></textarea>

            <button @click="sendMessage" class="send-btn">发送</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <div
      v-if="previewImageUrl"
      class="image-preview-modal"
      @click="previewImageUrl = null"
    >
      <img :src="previewImageUrl" />
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick, onMounted } from "vue";

export default {
  name: "ChatSupport",
  setup() {
    // 状态管理
    const isOpen = ref(false);
    const inputMessage = ref("");
    const showEmojiPicker = ref(false);
    const showHistory = ref(false);
    const previewImageUrl = ref(null);
    const unreadCount = ref(0);
    const fileInput = ref(null);
    const textInput = ref(null);
    const messagesContainer = ref(null);
    const currentSessionIndex = ref(0);

    // 模拟AI回复的简单逻辑
    const aiResponses = [
      "您好，请问有什么可以帮您？",
      "我明白了，正在为您处理...",
      "这个问题我们需要进一步核实",
      "感谢您的耐心等待",
      "请问您能提供更多细节吗？",
      "我们已经记录您的问题",
      "建议您尝试刷新页面",
      "这个问题可能需要技术支持介入",
      "我理解您的不便，非常抱歉",
      "我们会尽快解决这个问题",
    ];

    // 表情包列表
    const emojis = ["😀", "😂", "😍", "🤔", "😎", "👍", "❤️", "🙏", "🎉", "🔥"];

    // 聊天会话数据
    const chatSessions = ref([
      {
        startTime: new Date(),
        messages: [
          {
            sender: "ai",
            type: "text",
            content: "您好，请问有什么可以帮您？",
            time: new Date(),
          },
        ],
      },
    ]);

    // 计算当前会话
    const currentSession = computed(() => {
      return chatSessions.value[currentSessionIndex.value];
    });

    // 切换聊天窗口
    const toggleChat = () => {
      isOpen.value = !isOpen.value;
      if (isOpen.value) {
        unreadCount.value = 0;
        nextTick(() => {
          scrollToBottom();
          textInput.value?.focus();
        });
      }
    };
    // 计算属性获取所有消息
    const allMessages = computed(() => {
      return chatSessions.value.flatMap((session) => session.messages);
    });
    // 发送消息
    const sendMessage = () => {
      if (!inputMessage.value.trim()) return;

      // 添加用户消息
      addMessage({
        sender: "user",
        type: "text",
        content: inputMessage.value.trim(),
        time: new Date(),
      });

      inputMessage.value = "";

      // // 模拟AI回复
      setTimeout(async () => {
        // const randomResponse =
        //   aiResponses[Math.floor(Math.random() * aiResponses.length)];
        const randomResponse = await connectToAIService(
          inputMessage.value.trim()
        );
        addMessage({
          sender: "ai",
          type: "text",
          content: randomResponse,
          time: new Date(),
        });
      }, 500 + Math.random() * 200); // 1-3秒延迟
    };

    // 添加消息到当前会话
    const addMessage = (message) => {
      currentSession.value.messages.push(message);
      nextTick(() => {
        scrollToBottom();
      });

      // 如果窗口关闭且有新AI消息，增加未读计数
      if (!isOpen.value && message.sender === "ai") {
        unreadCount.value++;
      }
    };

    // 滚动到底部
    const scrollToBottom = () => {
      nextTick(() => {
        console.log("我被执行了", messagesContainer.value);
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop =
            messagesContainer.value.scrollHeight;
        }
      });
    };

    // 切换表情选择器
    const toggleEmojiPicker = () => {
      showEmojiPicker.value = !showEmojiPicker.value;
    };

    // 选择表情
    const selectEmoji = (emoji) => {
      inputMessage.value += emoji;
      showEmojiPicker.value = false;
      textInput.value?.focus();
    };

    // 触发文件选择
    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    // 处理图片上传
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        addMessage({
          sender: "user",
          type: "image",
          content: event.target.result,
          time: new Date(),
        });

        // 模拟AI回复图片
        setTimeout(() => {
          addMessage({
            sender: "ai",
            type: "text",
            content: "收到您发送的图片，正在为您处理...",
            time: new Date(),
          });
        }, 1500);
      };
      reader.readAsDataURL(file);
      e.target.value = ""; // 重置input
    };

    // 预览图片
    const previewImage = (url) => {
      previewImageUrl.value = url;
    };

    // 切换历史记录面板
    const toggleHistory = () => {
      showHistory.value = !showHistory.value;
    };

    // 加载历史会话
    const loadSession = (index) => {
      currentSessionIndex.value = index;
      showHistory.value = false;
      nextTick(() => {
        scrollToBottom();
      });
    };

    // 创建新会话
    const createNewSession = () => {
      chatSessions.value.push({
        startTime: new Date(),
        messages: [
          {
            sender: "ai",
            type: "text",
            content: "您好，请问有什么可以帮您？",
            time: new Date(),
          },
        ],
      });
      currentSessionIndex.value = chatSessions.value.length - 1;
    };

    // 格式化时间
    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // 格式化日期
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // 模拟连接AI服务
    const connectToAIService = async (message) => {
      // 这里可以替换为实际的AI API调用
      // 例如: const response = await fetch('your-ai-api-endpoint', {...});
      return new Promise((resolve) => {
        setTimeout(() => {
          const randomResponse =
            aiResponses[Math.floor(Math.random() * aiResponses.length)];
          resolve(randomResponse);
        }, 1000);
      });
    };

    // 组件挂载时初始化
    onMounted(() => {
      scrollToBottom();
      // 可以在这里添加初始化逻辑，比如从本地存储加载历史会话
      const savedSessions = localStorage.getItem("chatSessions");
      if (savedSessions) {
        chatSessions.value = JSON.parse(savedSessions);
      }
    });

    // 监视会话变化保存到本地存储
    watch(
      chatSessions,
      (newVal) => {
        localStorage.setItem("chatSessions", JSON.stringify(newVal));
      },
      { deep: true }
    );
    watch(
      () => currentSession.value.messages.length,
      () => {
        scrollToBottom();
      },
      { deep: true }
    );

    return {
      scrollToBottom,
      isOpen,
      inputMessage,
      showEmojiPicker,
      showHistory,
      previewImageUrl,
      unreadCount,
      fileInput,
      textInput,
      messagesContainer,
      currentSessionIndex,
      emojis,
      chatSessions,
      currentSession,
      toggleChat,
      sendMessage,
      toggleEmojiPicker,
      selectEmoji,
      triggerFileInput,
      handleImageUpload,
      previewImage,
      toggleHistory,
      loadSession,
      createNewSession,
      formatTime,
      formatDate,
    };
  },
};
</script>

<style scoped>
.chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: "Arial", sans-serif;
}

.chat-button {
  width: 60px;
  height: 60px;
  background-color: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: all 0.3s ease;
}

.chat-button:hover {
  background-color: #40a9ff;
  transform: scale(1.05);
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #f5222d;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.chat-window {
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: none;
  flex-direction: column;
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s ease;
}

.chat-open .chat-window {
  display: flex;
  transform: translateY(0);
  opacity: 1;
}

.chat-header {
  padding: 15px;
  background-color: #1890ff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.history-btn,
.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 12px;
  padding: 5px;
}

.close-btn {
  font-size: 20px;
  line-height: 1;
}

.chat-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.history-panel {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  padding: 10px;
  border-radius: 5px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-item:hover {
  background-color: #e6f7ff;
}

.history-item.active {
  background-color: #1890ff;
  color: white;
}

.history-time {
  font-size: 12px;
  margin-bottom: 5px;
}

.history-preview {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  position: relative;
  word-wrap: break-word;
}

.message.user {
  align-self: flex-end;
  background-color: #1890ff;
  color: white;
  border-bottom-right-radius: 5px;
}

.message.ai {
  align-self: flex-start;
  background-color: #f5f5f5;
  color: #333;
  border-bottom-left-radius: 5px;
}

.message.image {
  padding: 5px;
  background-color: transparent;
}

.message.emoji {
  font-size: 24px;
  background-color: transparent;
  padding: 5px;
}

.message-content img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 10px;
  cursor: zoom-in;
}

.message-time {
  font-size: 10px;
  color: #999;
  margin-top: 5px;
  text-align: right;
}

.user .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.input-area {
  padding: 10px;
  border-top: 1px solid #eee;
  position: relative;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
}

.tool-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 5px;
  color: #666;
}

.emoji-picker {
  position: absolute;
  bottom: 60px;
  left: 10px;
  background: white;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  max-height: 150px;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.emoji-picker span {
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
}

.emoji-picker span:hover {
  transform: scale(1.2);
}

textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 10px 15px;
  resize: none;
  min-height: 40px;
  max-height: 100px;
  outline: none;
  font-family: inherit;
}

.send-btn {
  position: absolute;
  right: 20px;
  bottom: 20px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.send-btn:hover {
  background-color: #40a9ff;
}

.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.image-preview-modal img {
  max-width: 90%;
  max-height: 90%;
}
.messages-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: min-content;
}

.input-area {
  padding: 10px;
  border-top: 1px solid #eee;
  position: relative;
  flex-shrink: 0; /* 防止输入区域被压缩 */
  background: white; /* 确保输入区域覆盖在消息上 */
  z-index: 1; /* 确保输入区域在上层 */
}
</style>
