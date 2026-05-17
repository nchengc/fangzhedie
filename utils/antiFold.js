const AntiFold = {
  addLineBreaks(text) {
    return text.replace(/([。！？；\?\!\;])/g, '$1\n');
  },

  addSoftSpaces(text) {
    const softSpace = '\u200b';
    let result = '';
    for (let char of text) {
      result += char;
      if (/[\u4e00-\u9fa5]/.test(char)) {
        result += softSpace;
      }
    }
    return result;
  },

  addDecorations(text) {
    const prefixEmojis = ['🎯', '✨', '💫', '📌', '👉'];
    const suffixEmojis = ['🔥', '💪', '👍', '✨', '📣'];
    const prefix = prefixEmojis[Math.floor(Math.random() * prefixEmojis.length)];
    const suffix = suffixEmojis[Math.floor(Math.random() * suffixEmojis.length)];
    return `${prefix} ${text} ${suffix}`;
  },

  addZeroWidth(text) {
    const zeroWidth = '\u200B';
    let result = '';
    for (let char of text) {
      result += char;
      if (/\S/.test(char)) {
        result += zeroWidth;
      }
    }
    return result;
  },

  generate(text, modes) {
    let result = text;
    
    if (modes.includes('分段换行')) {
      result = this.addLineBreaks(result);
    }
    if (modes.includes('软空格干扰')) {
      result = this.addSoftSpaces(result);
    }
    if (modes.includes('首尾符号伪装')) {
      result = this.addDecorations(result);
    }
    if (modes.includes('常规零宽字符')) {
      result = this.addZeroWidth(result);
    }
    
    return result;
  }
};

module.exports = AntiFold;
