const AntiFold = {
  addLineBreaks(text) {
    return text.replace(/([。！？；\?\!\;])/g, '$1\n');
  },

  addSoftSpaces(text, density = 3) {
    const softSpace = '​';
    let result = '';
    let count = 0;
    for (let char of text) {
      result += char;
      count++;
      // density=3 表示每3个汉字插入一个，density=2表示每2个
      if (/[一-龥]/.test(char) && count % density === 0) {
        result += softSpace;
      }
    }
    return result;
  },

  addDecorations(text) {
    const prefixEmojis = ['🎯', '✨', '💫', '📌', '👉', '🔹', '▪️', '▸'];
    const suffixEmojis = ['🔥', '💪', '👍', '✨', '📣', '▶️', '▪️', '▸'];
    const prefix = prefixEmojis[Math.floor(Math.random() * prefixEmojis.length)];
    const suffix = suffixEmojis[Math.floor(Math.random() * suffixEmojis.length)];
    return `${prefix} ${text} ${suffix}`;
  },

  addZeroWidth(text, density = 4) {
    const zeroWidth = '​';
    let result = '';
    let count = 0;
    for (let char of text) {
      result += char;
      count++;
      if (/\S/.test(char) && count % density === 0) {
        result += zeroWidth;
      }
    }
    return result;
  },

  // 计算视觉长度（汉字算2，其他算1）
  visualLength(str) {
    let len = 0;
    for (let c of str) {
      len += /[一-龥]/.test(c) ? 2 : 1;
    }
    return len;
  },

  // 裁剪到限制内
  trimToLimit(txt, maxLen) {
    let len = this.visualLength(txt);
    if (len <= maxLen) return txt;

    let out = '';
    let vLen = 0;
    for (let c of txt) {
      const cLen = /[一-龥]/.test(c) ? 2 : 1;
      if (vLen + cLen > maxLen) break;
      out += c;
      vLen += cLen;
    }
    return out;
  },

  generate(text, modes, maxLength = 1950) {
    const inputLen = this.visualLength(text);

    // 根据输入长度调整干扰密度
    let softDensity = 3;
    let zeroDensity = 4;

    if (inputLen >= 1000 && inputLen < 1500) {
      // 中长文本：增强防折叠
      softDensity = 2;
      zeroDensity = 3;
    } else if (inputLen >= 1500) {
      // 长文本：最大防折叠
      softDensity = 1;
      zeroDensity = 2;
    }

    let result = text;

    // 1. 先处理分段换行
    if (modes.includes('分段换行')) {
      result = this.addLineBreaks(result);
    }

    // 2. 再处理装饰符号
    if (modes.includes('首尾符号伪装')) {
      result = this.addDecorations(result);
    }

    if (this.visualLength(result) > maxLength) {
      result = this.trimToLimit(result, maxLength);
    }

    // 3. 处理软空格干扰（使用动态密度）
    if (modes.includes('软空格干扰')) {
      result = this.addSoftSpaces(result, softDensity);
      if (this.visualLength(result) > maxLength) {
        result = this.trimToLimit(result, maxLength);
      }
    }

    // 4. 处理零宽字符（使用动态密度）
    if (modes.includes('常规零宽字符')) {
      result = this.addZeroWidth(result, zeroDensity);
      if (this.visualLength(result) > maxLength) {
        result = this.trimToLimit(result, maxLength);
      }
    }

    return result;
  }
};

module.exports = AntiFold;