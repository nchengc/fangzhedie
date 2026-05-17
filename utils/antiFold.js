const AntiFold = {
  addLineBreaks(text) {
    return text.replace(/([。！？；\?\!\;])/g, '$1\n');
  },

  addSoftSpaces(text) {
    const softSpace = '​';
    let result = '';
    let count = 0;
    for (let char of text) {
      result += char;
      count++;
      // 每3个汉字插入一个零宽空格，比均匀分布减少总量
      if (/[一-龥]/.test(char) && count % 3 === 0) {
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
    const zeroWidth = '​';
    let result = '';
    let count = 0;
    for (let char of text) {
      result += char;
      count++;
      // 每4个非空字符插入一个零宽字符
      if (/\S/.test(char) && count % 4 === 0) {
        result += zeroWidth;
      }
    }
    return result;
  },

  generate(text, modes, maxLength = 1950) {
    let result = text;

    // 计算当前结果长度（视觉长度，非字符数）
    const visualLength = (str) => {
      let len = 0;
      for (let c of str) {
        len += /[一-龥]/.test(c) ? 2 : 1;
      }
      return len;
    };

    // 先处理分段换行（最有效）
    if (modes.includes('分段换行')) {
      result = this.addLineBreaks(result);
    }

    // 检查并裁剪到限制内
    const trimToLimit = (txt) => {
      let len = visualLength(txt);
      if (len <= maxLength) return txt;

      // 按字符逐个裁剪
      let out = '';
      let vLen = 0;
      for (let c of txt) {
        const cLen = /[一-龥]/.test(c) ? 2 : 1;
        if (vLen + cLen > maxLength) break;
        out += c;
        vLen += cLen;
      }
      return out;
    };

    // 再处理装饰符号
    if (modes.includes('首尾符号伪装')) {
      result = this.addDecorations(result);
    }

    // 检查长度，如果超限则裁剪后再继续
    if (visualLength(result) > maxLength) {
      result = trimToLimit(result);
    }

    // 处理软空格干扰
    if (modes.includes('软空格干扰')) {
      result = this.addSoftSpaces(result);
      if (visualLength(result) > maxLength) {
        result = trimToLimit(result);
      }
    }

    // 处理零宽字符
    if (modes.includes('常规零宽字符')) {
      result = this.addZeroWidth(result);
      if (visualLength(result) > maxLength) {
        result = trimToLimit(result);
      }
    }

    return result;
  }
};

module.exports = AntiFold;