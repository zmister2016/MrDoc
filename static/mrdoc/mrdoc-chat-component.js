class EnhancedDifyChatComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(
            document.getElementById('enhanced-dify-chat-template').content.cloneNode(true)
        );

        // 组件状态
        this.messages = [];
        this.conversationId = '';
        this.isTyping = false;
        this.apiEndpoint = this.getAttribute('api-endpoint') || '/ai/chat/stream/';
        this.textGenerateEndpoint = this.getAttribute('text-generate-endpoint') || '/ai_text_genarate/';
        this.welcome_str = this.getAttribute('welcome_str') || gettext('你好！我是AI智能助手，有什么可以帮助你的吗？')
        this.avatar_icon = this.getAttribute('avatar_icon')
        // 新增：存储思考过程的完整内容
        this.currentReasoning = '';
        this.initializeElements();
        this.setupEventListeners();
        this.showWelcomeMessage();
    }

    initializeElements() {
        this.messagesContainer = this.shadowRoot.getElementById('messages');
        this.chatInput = this.shadowRoot.getElementById('chatInput');
        this.sendButton = this.shadowRoot.getElementById('sendButton');
        this.typingIndicator = this.shadowRoot.getElementById('typingIndicator');
        this.emptyState = this.shadowRoot.getElementById('emptyState');
        this.clearBtn = this.shadowRoot.getElementById('clearBtn');
        this.exportBtn = this.shadowRoot.getElementById('exportBtn');
    }

    setupEventListeners() {
        // 发送消息
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // 键盘事件
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // 自动调整输入框高度
        this.chatInput.addEventListener('input', () => {
            this.adjustTextareaHeight();
        });

        // 清空对话
        // this.clearBtn.addEventListener('click', () => this.clearConversation());

        // 导出对话
        // this.exportBtn.addEventListener('click', () => this.exportConversation());
    }

    adjustTextareaHeight() {
        this.chatInput.style.height = 'auto';
        const height = Math.min(this.chatInput.scrollHeight, 120);
        this.chatInput.style.height = height + 'px';
    }

    showWelcomeMessage() {
        if (this.messages.length === 0) {
            this.addMessage('assistant', this.welcome_str);
        }
    }

    // 发送消息
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;

        // 隐藏空状态
        this.emptyState.style.display = 'none';

        // 添加用户消息
        this.addMessage('user', message);
        this.chatInput.value = '';
        this.adjustTextareaHeight();
        
        // 显示正在输入状态
        this.setTyping(true);

        try {
            await this.streamResponse(message);
        } catch (error) {
            console.log('发送消息错误:', error);
            this.addMessage('assistant', error.message);
        } finally {
            this.setTyping(false);
        }
    }

    addMessage(role, content, timestamp = new Date()) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${role}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        if (role === 'user') {
            avatar.textContent = gettext('我');
        } else {
            if(this.avatar_icon){
                // AI 使用图片头像
                const img = document.createElement('img');
                img.src = this.avatar_icon;
                img.alt = 'AI';
                img.className = 'avatar-image';
        
                avatar.appendChild(img);
            }else{
                avatar.textContent = 'AI'
            }
            
        }
        
        const contentElement = document.createElement('div');
        contentElement.className = 'message-content';
        
        if (role === 'assistant') {
            contentElement.innerHTML = this.parseMarkdown(content);
        } else {
            contentElement.textContent = content;
        }

        // 添加时间戳
        const timeElement = document.createElement('div');
        timeElement.className = 'message-time';
        timeElement.textContent = this.formatTime(timestamp);
        contentElement.appendChild(timeElement);
        
        messageElement.appendChild(avatar);
        messageElement.appendChild(contentElement);
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        this.messages.push({ role, content, timestamp });
    }

updateLastMessage(content) {
    const messages = this.messagesContainer.querySelectorAll('.message.assistant');
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
        // 首段答案到达时移除动态状态行
        this.clearStreamStatus();
        
        const contentElement = lastMessage.querySelector('.message-content');
        const timeElement = contentElement.querySelector('.message-time');
        const reasoningContainer = contentElement.querySelector('.reasoning-container');
        
        // 查找是否已经有回答内容容器
        let answerContainer = contentElement.querySelector('.answer-content');
        
        if (!answerContainer) {
            // 第一次创建回答容器
            answerContainer = document.createElement('div');
            answerContainer.className = 'answer-content';
            
            if (reasoningContainer) {
                reasoningContainer.insertAdjacentElement('afterend', answerContainer);
            } else if (timeElement) {
                timeElement.insertAdjacentElement('beforebegin', answerContainer);
            } else {
                contentElement.appendChild(answerContainer);
            }
        }
        
        // 只更新回答内容，不触发其他元素的重排
        answerContainer.innerHTML = this.parseMarkdown(content);
        
        // marked.hljsHandle();

        this.scrollToBottom();
        
        // 更新消息数组中的最后一条助手消息
        for (let i = this.messages.length - 1; i >= 0; i--) {
            if (this.messages[i].role === 'assistant') {
                this.messages[i].content = content;
                break;
            }
        }
    }
}

    // Markdown解析
    parseMarkdown(text) {
        return marked.getHtml({value:text});
    }

    formatTime(date) {
        return date.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    // 显示引用文档
    showSources(resources) {
        const sourcesContainer = document.createElement('div');
        sourcesContainer.className = 'source-docs-container';
        
        // 创建分隔线
        const separator = document.createElement('div');
        separator.className = 'source-separator';
        
        // 创建标题
        const title = document.createElement('div');
        title.className = 'source-title';
        title.innerHTML = '<strong>' + gettext('参考文档：') + '</strong>';
        
        // 创建链接容器
        const linksContainer = document.createElement('div');
        linksContainer.className = 'source-links';
        
        // 生成链接卡片
        resources.forEach((r, index) => {
            const linkCard = document.createElement('div');
            linkCard.className = 'source-link-card';
            
            const link = document.createElement('a');
            link.href = `/doc/${r.id}`;
            link.textContent = r.name;
            link.target = '_blank';
            link.className = 'source-link';
            
            // 添加图标
            const icon = document.createElement('span');
            icon.className = 'source-icon';
            icon.innerHTML = '📄'; // 可以替换为 SVG 或其他图标
            
            // 添加外链图标
            const externalIcon = document.createElement('span');
            externalIcon.className = 'external-icon';
            externalIcon.innerHTML = '↗';
            
            linkCard.appendChild(icon);
            linkCard.appendChild(link);
            linkCard.appendChild(externalIcon);
            
            linksContainer.appendChild(linkCard);
        });
        
        // 组装容器
        sourcesContainer.appendChild(separator);
        sourcesContainer.appendChild(title);
        sourcesContainer.appendChild(linksContainer);
        
        // 把来源文档挂到最后一条AI消息下面
        const messages = this.messagesContainer.querySelectorAll('.message.assistant > .message-content');
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
            lastMessage.appendChild(sourcesContainer);
            this.scrollToBottom();
        }
    }
    
    // 显示大模型思考过程
    showReasoning(content) {
        // 拼接流式返回的内容
        this.currentReasoning += content || '';
        
        // 把思考过程挂到最后一条AI消息下面
        const messages = this.messagesContainer.querySelectorAll('.message.assistant > .message-content');
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
            // 检查是否已经存在思考过程容器
            let reasoningContainer = lastMessage.querySelector('.reasoning-container');
            if (!reasoningContainer) {
                reasoningContainer = document.createElement('div');
                reasoningContainer.className = 'reasoning-container';
                
                // 创建标题
                const title = document.createElement('div');
                title.className = 'reasoning-title';
                title.innerHTML = '<strong>' + gettext('思考过程：') + '</strong> <span class="reasoning-toggle">' + gettext('收起') + '</span>';
                
                // 创建内容容器
                const contentElement = document.createElement('div');
                contentElement.className = 'reasoning-content';
                
                reasoningContainer.appendChild(title);
                reasoningContainer.appendChild(contentElement);
                lastMessage.insertBefore(reasoningContainer, lastMessage.firstChild)
                
                // 添加点击折叠/展开功能
                title.addEventListener('click', () => {
                    contentElement.classList.toggle('collapsed');
                    const toggle = title.querySelector('.reasoning-toggle');
                    if (contentElement.classList.contains('collapsed')) {
                        toggle.textContent = gettext('展开');
                    } else {
                        toggle.textContent = gettext('收起');
                    }
                });
            }
            
            // 更新思考过程内容
            const contentElement = reasoningContainer.querySelector('.reasoning-content');
            // contentElement.innerHTML = this.parseMarkdown(this.currentReasoning);
            // 直接使用纯文本，不做Markdown解析
            contentElement.textContent = this.currentReasoning;
            
            this.scrollToBottom();
        }
    }
    
    // 初始化消息内动态状态行
    initStreamStatus() {
        const messages = this.messagesContainer.querySelectorAll('.message.assistant > .message-content');
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage) return;
        if (lastMessage.querySelector('.stream-status')) return;

        const statusEl = document.createElement('div');
        statusEl.className = 'stream-status searching';
        statusEl.innerHTML = '<span class="status-spinner"></span><span class="status-text">' + gettext('正在处理...') + '</span>';
        lastMessage.appendChild(statusEl);
        this.scrollToBottom();
    }

    // 更新动态状态行
    updateStreamStatus(message, status) {
        const messages = this.messagesContainer.querySelectorAll('.message.assistant > .message-content');
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage) return;

        let statusEl = lastMessage.querySelector('.stream-status');
        if (!statusEl) {
            // 兜底：status 先于初始化到达时自动创建
            statusEl = document.createElement('div');
            statusEl.className = 'stream-status';
            lastMessage.appendChild(statusEl);
        }

        statusEl.className = `stream-status ${status || ''}`;
        let textEl = statusEl.querySelector('.status-text');
        if (!textEl) {
            textEl = document.createElement('span');
            textEl.className = 'status-text';
            statusEl.appendChild(textEl);
        }
        textEl.textContent = message || gettext('处理中...');
        this.scrollToBottom();
    }

    // 移除动态状态行
    clearStreamStatus() {
        const messages = this.messagesContainer.querySelectorAll('.message.assistant > .message-content');
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
            const statusEl = lastMessage.querySelector('.stream-status');
            if (statusEl) statusEl.remove();
        }
    }

    // 流式响应
    async streamResponse(message) {
        try {
            const csrfToken = this.getCSRFToken();
            
            let response;

            try{
                response = await fetch(this.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    body: JSON.stringify({
                        inputs: { query: message },
                        conversation_id: this.conversationId
                    }),
                });
            }catch(error){
                throw new Error(gettext('接口网络请求失败'));
            }

            if (!response.ok) {
                throw new Error(interpolate(gettext('接口响应错误: %(status)s'), {status: response.status}, true));
            }

            // ✅ 先检查是不是 JSON 响应
            const contentType = response.headers.get("Content-Type") || "";
            if (contentType.includes("application/json")) {
                const data = await response.json();
                if (!data.status) {
                    throw new Error(data.data || gettext("请求失败"));
                }
                return; // JSON 响应处理完毕，直接返回
            }

            // 添加空的助手消息作为容器
            this.addMessage('assistant', '');
            
            // 初始化消息内动态状态行
            this.initStreamStatus();
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let fullResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                
                // 保留最后一行（可能不完整）
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            
                            if (data.event === 'message') {
                                fullResponse += data.answer || '';
                                this.updateLastMessage(fullResponse);
                            } else if (data.event === 'reasoning') {
                                // 显示大模型思考过程
                                this.showReasoning(data.answer || '');
                            } else if (data.event === 'status') {
                                // 动态状态：知识库检索中 / 已检索到相关知识 / 正在组织回答
                                this.updateStreamStatus(data.message || '', data.status || '');
                            } else if (data.event === 'message_end') {
                                // 保存对话ID用于后续对话
                                if (data.conversation_id) {
                                    this.conversationId = data.conversation_id;
                                }
                                const noAnswerTexts = [
                                    '未在文档中找到相关内容',
                                    '未在文档中找到相关内容。',
                                    '未找到相关内容',
                                    '未找到相关内容。',
                                ];
                                const hasAnswer = !noAnswerTexts.includes(
                                    fullResponse.trim()
                                );
                                // 显示来源文档
                                if (data.sources.length > 0 && hasAnswer) {
                                    //console.log("渲染来源文档")
                                    this.showSources(data.sources);
                                }
                                
                                // 清理状态行（兜底）
                                this.clearStreamStatus();
                                
                                // 重置思考过程
                                this.currentReasoning = '';

                                console.log('对话结束:', data);
                            } else if (data.event === 'error') {
                                this.updateLastMessage(data.message || gettext('发生未知错误'));
                                // throw new Error(data.message || '发生未知错误');
                            }
                        } catch (e) {
                            console.warn('JSON解析错误:', e, 'line:', line);
                            this.updateLastMessage(interpolate(gettext('JSON响应解析错误：%(error)s'), {error: e}, true));
                        }
                    }
                }
            }

            // 处理剩余的buffer
            if (buffer.startsWith('data: ')) {
                try {
                    const data = JSON.parse(buffer.slice(6));
                    if (data.event === 'message') {
                        fullResponse += data.answer || '';
                        this.updateLastMessage(fullResponse);
                    }
                } catch (e) {
                    console.warn('最终JSON解析错误:', e);
                }
            }

        } catch (error) {
            console.error('流式响应错误:', error);
            throw error;
        }
    }

    setTyping(isTyping) {
        this.isTyping = isTyping;
        this.sendButton.disabled = isTyping;
        this.typingIndicator.classList.toggle('show', isTyping);
        if (isTyping) {
            this.scrollToBottom();
        }
    }

    // 跳转到底部
    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 10);
    }

    clearConversation() {
        if (confirm(gettext('确定要清空当前对话吗？'))) {
            this.messages = [];
            this.conversationId = '';
            this.messagesContainer.innerHTML = '';
            this.emptyState.style.display = 'flex';
            this.showWelcomeMessage();
        }
    }

    exportConversation() {
        if (this.messages.length === 0) {
            alert(gettext('没有对话内容可以导出'));
            return;
        }

        let exportText = gettext('# AI对话记录') + '\n\n';
        exportText += interpolate(gettext('导出时间: %(time)s'), {time: new Date().toLocaleString('zh-CN')}, true) + '\n\n';
        exportText += '---\n\n';

        this.messages.forEach((message, index) => {
            const role = message.role === 'user' ? gettext('用户') : gettext('AI助手');
            const time = message.timestamp ? message.timestamp.toLocaleTimeString('zh-CN') : '';
            exportText += `## ${role} ${time}\n\n${message.content}\n\n`;
        });

        // 创建下载链接
        const blob = new Blob([exportText], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = interpolate(gettext('AI对话记录_%(date)s'), {date: new Date().toISOString().slice(0, 10)}, true) + '.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    getCSRFToken() {
        // 尝试从cookie获取CSRF token
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        
        // 尝试从页面中的hidden input获取
        const csrfInput = document.querySelector('[name=csrfmiddlewaretoken]');
        return csrfInput ? csrfInput.value : '';
    }

    // 新对话
    newConversation() {
        this.clearConversation();
        this.conversationId = '';
    }

    // 加载指定对话
    loadConversation(conversationId) {
        // 这里可以实现从服务器加载历史对话的逻辑
        this.conversationId = conversationId;
        // TODO: 调用API获取历史消息并显示
    }
}

// 对话管理器
class ConversationManager {
    constructor() {
        this.conversations = JSON.parse(localStorage.getItem('dify_conversations') || '[]');
        this.currentConversationId = '';
        this.chatComponent = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.renderConversations();
    }

    initializeElements() {
        this.newChatBtn = document.getElementById('newChatBtn');
        this.conversationsList = document.getElementById('conversationsList');
        this.chatComponent = document.querySelector('enhanced-dify-chat');
    }

    setupEventListeners() {
        this.newChatBtn.addEventListener('click', () => this.createNewConversation());
    }

    createNewConversation() {
        const conversation = {
            id: this.generateId(),
            title: gettext('新对话'),
            createdAt: new Date(),
            messages: []
        };

        this.conversations.unshift(conversation);
        this.saveConversations();
        this.setCurrentConversation(conversation.id);
        this.renderConversations();
        
        if (this.chatComponent) {
            this.chatComponent.newConversation();
        }
    }

    setCurrentConversation(conversationId) {
        this.currentConversationId = conversationId;
        
        // 更新UI状态
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-conversation-id="${conversationId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    deleteConversation(conversationId, event) {
        event.stopPropagation();
        
        if (confirm(gettext('确定要删除这个对话吗？'))) {
            this.conversations = this.conversations.filter(conv => conv.id !== conversationId);
            this.saveConversations();
            this.renderConversations();
            
            // 如果删除的是当前对话，创建新对话
            if (this.currentConversationId === conversationId) {
                this.createNewConversation();
            }
        }
    }

    renderConversations() {
        this.conversationsList.innerHTML = '';
        
        this.conversations.forEach(conversation => {
            const item = document.createElement('div');
            item.className = 'conversation-item';
            item.setAttribute('data-conversation-id', conversation.id);
            
            if (conversation.id === this.currentConversationId) {
                item.classList.add('active');
            }
            
            item.innerHTML = `
                <div class="conversation-title">${conversation.title}</div>
                <div class="conversation-time">${this.formatDate(conversation.createdAt)}</div>
                <button class="conversation-delete">×</button>
            `;
            
            // 点击切换对话
            item.addEventListener('click', () => {
                this.setCurrentConversation(conversation.id);
                if (this.chatComponent) {
                    this.chatComponent.loadConversation(conversation.id);
                }
            });
            
            // 删除对话
            const deleteBtn = item.querySelector('.conversation-delete');
            deleteBtn.addEventListener('click', (e) => this.deleteConversation(conversation.id, e));
            
            this.conversationsList.appendChild(item);
        });
        
        // 如果没有对话，创建第一个
        if (this.conversations.length === 0) {
            this.createNewConversation();
        }
    }

    saveConversations() {
        localStorage.setItem('dify_conversations', JSON.stringify(this.conversations));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatDate(date) {
        const now = new Date();
        const conversationDate = new Date(date);
        const diffTime = Math.abs(now - conversationDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return gettext('今天') + ' ' + conversationDate.toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else if (diffDays === 2) {
            return gettext('昨天');
        } else if (diffDays <= 7) {
            return interpolate(gettext('%(days)s天前'), {days: diffDays - 1}, true);
        } else {
            return conversationDate.toLocaleDateString('zh-CN');
        }
    }
}

// 注册自定义元素
customElements.define('mrdoc-ai-chat', EnhancedDifyChatComponent);

// 初始化对话管理器
document.addEventListener('DOMContentLoaded', () => {
    new ConversationManager();
});