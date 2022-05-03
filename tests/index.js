const { cut, init, ready } = require("../dist/index");

const txt = `
自然语言处理( Natural Language Processing, NLP)是计算机科学领域与人工智能领域中的一个重要方向。它研究能实现人与计算机之间用自然语言进行有效通信的各种理论和方法。自然语言处理是一门融语言学、计算机科学、数学于一体的科学。因此，这一领域的研究将涉及自然语言，即人们日常使用的语言，所以它与语言学的研究有着密切的联系，但又有重要的区别。自然语言处理并不是一般地研究自然语言，而在于研制能有效地实现自然语言通信的计算机系统，特别是其中的软件系统。因而它是计算机科学的一部分。
自然语言处理主要应用于机器翻译、舆情监测、自动摘要、观点提取、文本分类、问题回答、文本语义对比、语音识别、中文OCR等方面。
`;

console.log("start cut");

ready().then(() => {
  console.log("load successful");
  init();
  console.log("init successful");
  const words = cut(txt);

  const map = new Map();
  for (const word of words) {
    const counter = map.get(word) || 0;
    map.set(word, counter + 1);
  }
  const top = Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  console.log(top);
});
