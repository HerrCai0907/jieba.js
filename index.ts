import assert from "assert";
import { Jieba } from "./jieba";

let moduleRef: number = 0;

function getStringLength(str: string): number {
  return str.length * 4 + 1;
}
function constructorString(str: string): number {
  const len = getStringLength(str);
  const ptr = Jieba._malloc(len);
  Jieba.StringToUTF8(str, ptr, len);
  return ptr;
}
function destructorString(ptr: number) {
  if (ptr != 0) Jieba._free(ptr);
}

export function ready() {
  return new Promise<void>((resolve) => {
    const tryLoad = () => {
      setTimeout(() => {
        if (Jieba.asm == undefined) {
          tryLoad();
        } else {
          resolve();
        }
      }, 0);
    };
    tryLoad();
  });
}

export function init(
  dictPath?: string | null,
  hmmPath?: string | null,
  userDictPath?: string | null,
  idfPath?: string | null,
  stopWordPath?: string | null
) {
  if (Jieba.asm == undefined) throw Error("jieba wasm not load, please call 'ready' first");
  const dict_path_ptr = dictPath == null ? 0 : constructorString(dictPath);
  const hmm_path_ptr = hmmPath == null ? 0 : constructorString(hmmPath);
  const user_dict_path_ptr = userDictPath == null ? 0 : constructorString(userDictPath);
  const idf_path_ptr = idfPath == null ? 0 : constructorString(idfPath);
  const stop_word_path_ptr = stopWordPath == null ? 0 : constructorString(stopWordPath);
  moduleRef = Jieba._init(dict_path_ptr, hmm_path_ptr, user_dict_path_ptr, idf_path_ptr, stop_word_path_ptr);
  destructorString(dict_path_ptr);
  destructorString(hmm_path_ptr);
  destructorString(user_dict_path_ptr);
  destructorString(idf_path_ptr);
  destructorString(stop_word_path_ptr);
}

export type ExtractResult = { word: string; weight: number };

export function extract(str: string, topN: number): ExtractResult[] {
  if (moduleRef == 0) throw Error("jieba module not init or init failed");
  const strRef = constructorString(str);

  let resultAssumeSize = topN * 40;
  let resultRef = Jieba._malloc(resultAssumeSize); // worst case each string have a sep

  let weightsRef = Jieba._malloc(topN * 8); // each double 8 bytes

  while (Jieba._extract(moduleRef, strRef, topN, resultRef, resultAssumeSize, weightsRef) == -1) {
    Jieba._free(resultRef);
    resultAssumeSize *= 2;
    resultRef = Jieba._malloc(resultAssumeSize);
  }

  const words = Jieba.UTF8ToString(resultRef, resultAssumeSize).split("/");

  const res = words.map((word, index) => {
    const weight = Jieba.HEAPF64.at((weightsRef >> 3) + index);
    assert(weight);
    return { word, weight };
  });

  Jieba._free(weightsRef);
  Jieba._free(resultRef);
  destructorString(strRef);

  return res;
}

export function cut(str: string): string[] {
  if (moduleRef == 0) throw Error("jieba module not init or init failed");
  const strRef = constructorString(str);

  let resultAssumeSize = getStringLength(str) * 2;
  let resultRef = Jieba._malloc(resultAssumeSize); // worst case each string have a sep
  while (Jieba._cut(moduleRef, strRef, resultRef, resultAssumeSize) == -1) {
    Jieba._free(resultRef);
    resultAssumeSize *= 2;
    resultRef = Jieba._malloc(resultAssumeSize);
  }
  const result = Jieba.UTF8ToString(resultRef, resultAssumeSize).split("/");

  Jieba._free(resultRef);
  destructorString(strRef);

  return result;
}
