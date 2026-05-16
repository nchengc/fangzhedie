const AntiFold = require('../../utils/antiFold.js');

Page({
  data: {
    inputText: '',
    showHistory: false,
    history: []
  },

  onLoad() {
    this.loadHistory();
  },

  onInput(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  randomModes() {
    const allModes = ['分段换行', '软空格干扰', '首尾符号伪装', '常规零宽字符'];
    const numModes = Math.floor(Math.random() * 3) + 2;
    const shuffled = allModes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numModes);
  },

  onGenerate() {
    const { inputText } = this.data;
    
    if (!inputText.trim()) {
      wx.showToast({
        title: '请先输入文案',
        icon: 'none'
      });
      return;
    }

    const modes = this.randomModes();
    const generated = AntiFold.generate(inputText, modes);
    
    wx.setClipboardData({
      data: generated,
      success: () => {
        wx.showToast({
          title: '已生成并复制',
          icon: 'success',
          duration: 2000
        });
        
        this.saveToHistory(inputText, modes);
      }
    });
  },

  onPaste() {
    wx.getClipboardData({
      success: (res) => {
        if (res.data) {
          const currentText = this.data.inputText;
          const newText = currentText ? currentText + '\n' + res.data : res.data;
          
          if (newText.length > 2000) {
            wx.showToast({
              title: '粘贴后超过2000字限制',
              icon: 'none'
            });
            return;
          }
          
          this.setData({
            inputText: newText
          });
          
          wx.showToast({
            title: '已粘贴',
            icon: 'success',
            duration: 1500
          });
        } else {
          wx.showToast({
            title: '剪贴板为空',
            icon: 'none'
          });
        }
      }
    });
  },

  toggleHistory() {
    this.setData({
      showHistory: !this.data.showHistory
    });
  },

  onClearHistory() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('antiFoldHistory');
          this.setData({
            history: []
          });
          wx.showToast({
            title: '已清除',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  onHistoryClick(e) {
    const id = e.currentTarget.dataset.id;
    const historyItem = this.data.history.find(item => item.id === id);
    
    if (historyItem) {
      this.setData({
        inputText: historyItem.content
      });
      
      wx.showToast({
        title: '已填充到输入框',
        icon: 'none',
        duration: 1500
      });
    }
  },

  loadHistory() {
    try {
      const history = wx.getStorageSync('antiFoldHistory') || [];
      const formattedHistory = history.map(item => ({
        ...item,
        timeStr: this.formatTime(item.createdAt)
      }));
      this.setData({
        history: formattedHistory
      });
    } catch (e) {
      console.error('加载历史记录失败', e);
    }
  },

  saveToHistory(content, modes) {
    try {
      let history = wx.getStorageSync('antiFoldHistory') || [];
      
      const newRecord = {
        id: this.generateUUID(),
        content: content,
        createdAt: Date.now()
      };
      
      history.unshift(newRecord);
      
      if (history.length > 15) {
        history = history.slice(0, 15);
      }
      
      wx.setStorageSync('antiFoldHistory', history);
      
      this.loadHistory();
    } catch (e) {
      console.error('保存历史记录失败', e);
    }
  },

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
})
