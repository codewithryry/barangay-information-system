<template>
  <div class="chatbot-container">
  <button 
    v-show="!isOpen"
    class="chatbot-toggle btn btn-primary rounded-pill shadow-lg"
    @click="toggleChatbot"
    :aria-expanded="isOpen ? 'true' : 'false'"
    aria-label="Toggle Barangay AI chatbot"
    :class="{ 'btn-primary-active': isOpen }"
    style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;"
  >
    <i class="fas fa-comments me-2"></i>
    {{ isOpen ? 'Close Chat' : 'Ask Barangay AI' }}
    <span 
      v-if="unreadCount > 0" 
      class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
      aria-hidden="true"
    >
      {{ unreadCount }}
      <span class="visually-hidden">Unread messages</span>
    </span>
  </button>


    
    <transition name="chatbot-slide">
      <div 
        class="chatbot-window" 
        v-show="isOpen"
        aria-modal="true"
        role="dialog"
        aria-labelledby="chatbot-header"
      >
        <div class="chatbot-header bg-primary text-white">
          <h5 class="mb-0" id="chatbot-header">
            <i class="fas fa-headset me-2"></i> Barangay AI
          </h5>
          <button 
            class="btn btn-sm btn-light rounded-circle" 
            @click="toggleChatbot"
            aria-label="Close chatbot"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="chatbot-messages" ref="messagesContainer">
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            class="message"
            :class="message.sender"
          >
            <div class="message-content">
              <div v-if="message.sender === 'bot'" class="message-avatar">
               <i class="fas fa-headset"></i>

              </div>
              <div class="message-text">
                <div v-if="message.sender === 'bot'" class="message-name">AI</div>
              
                <div class="message-bubble" v-html="formatMessage(message.text)"></div>
               
              </div>
            </div>
          </div>
          
          <div v-if="isLoading" class="message bot">
            <div class="message-content">
              <div class="message-avatar">
               <i class="fas fa-headset"></i>

              </div>
              <div class="message-text">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="alert alert-danger mt-2 mx-2 mb-0">
            <i class="fas fa-exclamation-circle me-2"></i>
            {{ errorMessage }}
          </div>
        </div>
        
        <div class="chatbot-input-area">
          <div class="chatbot-input">
            <input
              v-model="userInput"
              type="text"
              placeholder="Ask about barangay services..."
              @keyup.enter="sendMessage"
              :disabled="isLoading || isRateLimited"
              aria-label="Type your message"
            />
            <button 
              class="btn btn-send"
              @click="sendMessage"
              :disabled="!userInput || isLoading || isRateLimited"
              aria-label="Send message"
            >
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
          <div v-if="isRateLimited" class="rate-limit-notice text-center small py-1">
            <i class="fas fa-clock me-1"></i>
            Please wait a moment before sending another message
          </div>
          <div class="disclaimer small text-muted px-2 py-1">
            Barangay AI may produce inaccurate information
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Chatbot',
  data() {
    return {
      isOpen: false,
      userInput: '',
      messages: [
        {
          sender: 'bot',
          text: 'Hello! I\'m your Barangay AI Assistant. I can help with:\n\n• Barangay clearances\n• Business permits\n• Resident registration\n• Local services\n\nHow can I assist you today?',
          timestamp: new Date()
        }
      ],
      isLoading: false,
      errorMessage: '',
      isRateLimited: false,
      lastMessageTime: 0,
      unreadCount: 0,
      cohereApiKey: 'S71k5smrgIHbjFdeLkluk0KzZzkkuyej7CWNljnv',
      rateLimitDelay: 3000 // 3 seconds between messages
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.unreadCount = 0
      }
    },
    messages() {
      if (!this.isOpen && this.messages.length > 1) {
        this.unreadCount = this.messages.filter(m => m.sender === 'bot').length - 1
      }
    }
  },
  methods: {
    toggleChatbot() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
    formatMessage(text) {
      // Simple formatting for links and lists
      return text
        .replace(/\n/g, '<br>')
        .replace(/\•/g, '•')
    },
    formatTime(date) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    async sendMessage() {
      if (!this.userInput.trim() || this.isRateLimited) return
      
      // Check rate limiting
      const now = Date.now()
      if (now - this.lastMessageTime < this.rateLimitDelay) {
        this.activateRateLimit()
        return
      }
      
      this.lastMessageTime = now
      const userMessage = this.userInput
      this.messages.push({
        sender: 'user',
        text: userMessage,
        timestamp: new Date()
      })
      
      this.userInput = ''
      this.isLoading = true
      this.errorMessage = ''
      
      this.$nextTick(() => {
        this.scrollToBottom()
      })
      
      try {
        const response = await this.generateResponse(userMessage)
        this.messages.push({
          sender: 'bot',
          text: response,
          timestamp: new Date()
        })
      } catch (error) {
        console.error('Error in chatbot:', error)
        this.handleError(error)
      } finally {
        this.isLoading = false
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
    activateRateLimit() {
      this.isRateLimited = true
      this.errorMessage = 'Please wait a moment before sending another message'
      
      setTimeout(() => {
        this.isRateLimited = false
        this.errorMessage = ''
      }, this.rateLimitDelay)
    },
    handleError(error) {
      if (error.response) {
        // API error response
        if (error.response.status === 429) {
          this.errorMessage = 'Too many requests. Please wait a moment and try again.'
          this.activateRateLimit()
        } else {
          this.errorMessage = 'Service temporarily unavailable. Please try again later.'
        }
      } else if (error.request) {
        // No response received
        this.errorMessage = 'Network error. Please check your internet connection.'
      } else {
        // Other errors
        this.errorMessage = 'An unexpected error occurred. Please try again.'
      }
      
      this.messages.push({
        sender: 'bot',
        text: 'Sorry, I encountered an issue. ' + this.errorMessage,
        timestamp: new Date()
      })
    },
    async generateResponse(prompt) {
      // Enhanced prompt with barangay context
      const enhancedPrompt = `
        You are an AI assistant for a Barangay in the Philippines. 
        Your purpose is to help residents with barangay-related inquiries.
        Be friendly, professional, and concise in your responses (1-2 short paragraphs max).
        If you don't know the answer, direct them to contact barangay officials.
        
        Common topics include:
        - Barangay clearance requirements and process
        - Business permit applications
        - Resident registration
        - Barangay events and activities
        - Filing complaints or concerns
        - Contact information for barangay officials
        - Barangay health services
        - Community tax certificate (cedula)
        
        Current user question: ${prompt}
        
        Response guidelines:
        - Keep responses under 300 characters
        - Use simple, clear language
        - Provide step-by-step instructions when applicable
        - For complex queries, suggest visiting the barangay hall
        - Format lists with bullet points
        - Be culturally appropriate for Filipino context
      `;
      
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.cohereApiKey}`
        },
        body: JSON.stringify({
          model: 'command',
          prompt: enhancedPrompt,
          max_tokens: 200,
          temperature: 0.7,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(
          errorData.message || `API request failed with status ${response.status}`
        );
        error.response = response;
        throw error;
      }
      
      const data = await response.json();
      return data.generations[0].text.trim();
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  }
}
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1050;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
}

.chatbot-toggle {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 12px 20px;
  font-weight: 500;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 1;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
}

.chatbot-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.15);
}

.chatbot-toggle:active {
  transform: translateY(0);
}

.unread-count {
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 0.7rem;
  padding: 0.35em 0.5em;
}

.chatbot-slide-enter-active,
.chatbot-slide-leave-active {
  transition: all 0.3s ease;
}

.chatbot-slide-enter-from,
.chatbot-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.chatbot-window {
  width: 350px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: bottom right;
}

.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.chatbot-header h5 {
  font-weight: 600;
  font-size: 1.1rem;
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: #f5f7fb;
  scroll-behavior: smooth;
}

/* Custom scrollbar */
.chatbot-messages::-webkit-scrollbar {
  width: 6px;
}

.chatbot-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chatbot-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chatbot-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.message {
  margin-bottom: 15px;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  flex-shrink: 0;
  font-size: 0.9rem;
}

.message-text {
  max-width: calc(100% - 46px);
  display: flex;
  flex-direction: column;
}

.message-name {
  font-size: 0.7rem;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 3px;
}

.message-time {
  font-size: 0.6rem;
  color: #adb5bd;
  margin-top: 4px;
  text-align: right;
}

.message-bubble {
  padding: 10px 15px;
  border-radius: 18px;
  line-height: 1.4;
  font-size: 0.9rem;
  word-wrap: break-word;
  max-width: 100%;
}

.message.bot .message-bubble {
  background: white;
  border-bottom-left-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  color: #333;
}

.message.user .message-bubble {
  background: #0d6efd;
  color: white;
  border-bottom-right-radius: 5px;
}

.message.user {
  justify-content: flex-end;
}

.message.user .message-content {
  flex-direction: row-reverse;
}

.message.user .message-text {
  align-items: flex-end;
}

.message.user .message-avatar {
  background: #0d6efd;
  color: white;
}

.chatbot-input-area {
  background: white;
  border-top: 1px solid #e9ecef;
}

.chatbot-input {
  display: flex;
  padding: 10px 15px;
  align-items: center;
}

.chatbot-input input {
  flex: 1;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  padding: 10px 15px;
  outline: none;
  margin-right: 10px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.chatbot-input input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.1);
}

.btn-send {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d6efd;
  border: none;
  color: white;
  transition: all 0.2s;
}

.btn-send:hover {
  background: #0b5ed7;
  transform: scale(1.05);
}

.btn-send:disabled {
  background: #adb5bd;
  cursor: not-allowed;
  transform: none;
}

.typing-indicator {
  display: flex;
  padding: 10px 15px;
  background: white;
  border-radius: 18px;
  border-bottom-left-radius: 5px;
  width: fit-content;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #adb5bd;
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

.rate-limit-notice {
  background-color: #fff8f8;
  color: #dc3545;
  font-size: 0.75rem;
}

.disclaimer {
  font-size: 0.7rem;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

@keyframes bounce {
  0%, 80%, 100% { 
    transform: scale(0);
  }
  40% { 
    transform: scale(1);
  }
}

@media (max-width: 576px) {
  .chatbot-container {
    right: 15px;
    bottom: 15px;
  }
  
  .chatbot-window {
    width: calc(100vw - 30px);
    max-height: 70vh;
  }
  
  .chatbot-toggle {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}
.chatbot-toggle {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  position: relative;
}

.chatbot-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.chatbot-toggle:active {
  transform: translateY(0);
}

.chatbot-toggle:focus {
  outline: none;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.5) !important;
}

.btn-primary-active {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.badge {
  font-size: 0.65rem;
  padding: 0.35em 0.5em;
  min-width: 1.25em;
}

@media (max-width: 576px) {
  .chatbot-toggle {
    padding: 0.6rem 1.25rem;
    font-size: 0.9rem;
  }
}
</style>