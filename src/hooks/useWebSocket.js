
import { ref, reactive, onUnmounted, onMounted } from "vue";
export function useWebSocket(url) {
  const socket = ref(null);
  const messages = ref(null);
  const list = ['a']


  const connect = () => {
    socket.value = new WebSocket(url);

    socket.value.onopen = () => {
      console.log('WebSocket连接已建立');
    };

    socket.value.onmessage = (event) => {
      messages.value = event.data;
      // console.log('收到消息:', event.data);
    };

    socket.value.onclose = () => {
      console.log('WebSocket连接已关闭');
    };

    socket.value.onerror = (error) => {
      console.error('WebSocket错误:', error);
    };
  };

  const sendMessage = (message) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      // 如果 message 是对象，则先序列化为 JSON 字符串
      const msgString = typeof message === 'object' ? JSON.stringify(message) : message;
      socket.value.send(msgString);
      console.log('发送消息:', msgString);
    } else {
      console.error('WebSocket未连接');
    }
  };

  onUnmounted(() => {
    if (socket.value) {
      socket.value.close();
    }
  });

  onMounted(() => {
    connect();  // 在组件挂载时连接 WebSocket
    // 确保在 WebSocket 连接成功后发送消息
    // 注意：这里只是演示如何在连接后发送消息，实际应用中可能需要更复杂的逻辑来处理重试等场景
    setTimeout(() => {
      sendMessage({ type: "getAll" });
    }, 3000); // 假设等待1秒确保连接已经建立
  });

  return { socket, messages, sendMessage };
}