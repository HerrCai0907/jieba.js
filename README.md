# jieba.js

This is javascript version jieba.

compile [cpp version](https://github.com/yanyiwu/cppjieba.git) to wasm and can run in javascript

## Usage

```typescript
export declare function ready(): Promise<void>;
export declare function init(
  dictPath?: string | null,
  hmmPath?: string | null,
  userDictPath?: string | null,
  idfPath?: string | null,
  stopWordPath?: string | null
): void;
export declare type ExtractResult = {
  word: string;
  weight: number;
};
export declare function extract(str: string, topN: number): ExtractResult[];
export declare function cut(str: string): string[];
```

## example

```javascript
const { init, cut, extract, ready } = require("../dist/index");

const txt = `
自然语言处理( Natural Language Processing, NLP)是计算机科学领域与人工智能领域中的一个重要方向。它研究能实现人与计算机之间用自然语言进行有效通信的各种理论和方法。自然语言处理是一门融语言学、计算机科学、数学于一体的科学。因此，这一领域的研究将涉及自然语言，即人们日常使用的语言，所以它与语言学的研究有着密切的联系，但又有重要的区别。自然语言处理并不是一般地研究自然语言，而在于研制能有效地实现自然语言通信的计算机系统，特别是其中的软件系统。因而它是计算机科学的一部分。
自然语言处理主要应用于机器翻译、舆情监测、自动摘要、观点提取、文本分类、问题回答、文本语义对比、语音识别、中文OCR等方面。
`;

ready().then(() => {
  init();
  const words = cut(txt);
  const extractWords = extract(txt, 10);
});
```

words should be like
`["\n","自然语言","处理","("," ","Natural"," ","Language"," ","Processing",","," ","NLP",")","是","计算机科学","领域","与","人工智能","领域","中","的","一个","重要","方向","。","它","研究","能","实现","人","与","计算机","之间","用","自然语言","进行","有效","通信","的","各种","理论","和","方法","。","自然语言","处理","是","一门","融","语言学","、","计算机科学","、","数学","于","一体","的","科学","。","因此","，","这一","领域","的","研究","将","涉及","自然语言","，","即","人们","日常","使用","的","语言","，","所以","它","与","语言学","的","研究","有着","密切","的","联系","，","但","又","有","重要","的","区别","。","自然语言","处理","并","不是","一般","地","研究","自然语言","，","而","在于","研制","能","有效","地","实现","自然语言","通信","的","计算机系统","，","特别","是","其中","的","软件系统","。","因而","它","是","计算机科学","的","一部分","。","\n","自然语言","处理","主要","应用","于","机器翻译","、","舆情","监测","、","自动","摘要","、","观点","提取","、","文本","分类","、","问题","回答","、","文本","语义","对比","、","语音","识别","、","中文","OCR","等","方面","。","\n"]`

extractWords should be like`[{"word":"自然语言","weight":83.4795339936},{"word":"计算机科学","weight":29.27262877674},{"word":"处理","weight":21.64342262944},{"word":"语言学","weight":17.91807045874},{"word":"文本","weight":17.88970118874},{"word":"研究","weight":17.2950064398},{"word":"领域","weight":16.23688662723},{"word":"通信","weight":13.28312304776},{"word":"机器翻译","weight":12.2912397395},{"word":"Language","weight":11.739204307083542}]`
