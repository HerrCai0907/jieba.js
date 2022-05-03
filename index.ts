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
  dict_path?: string | null,
  hmm_path?: string | null,
  user_dict_path?: string | null,
  idf_path?: string | null,
  stop_word_path?: string | null
) {
  if (Jieba.asm == undefined) throw Error("jieba wasm not load, please call 'ready' first");
  const dict_path_ptr = dict_path == null ? 0 : constructorString(dict_path);
  const hmm_path_ptr = hmm_path == null ? 0 : constructorString(hmm_path);
  const user_dict_path_ptr = user_dict_path == null ? 0 : constructorString(user_dict_path);
  const idf_path_ptr = idf_path == null ? 0 : constructorString(idf_path);
  const stop_word_path_ptr = stop_word_path == null ? 0 : constructorString(stop_word_path);
  moduleRef = Jieba._Init(dict_path_ptr, hmm_path_ptr, user_dict_path_ptr, idf_path_ptr, stop_word_path_ptr);
  destructorString(dict_path_ptr);
  destructorString(hmm_path_ptr);
  destructorString(user_dict_path_ptr);
  destructorString(idf_path_ptr);
  destructorString(stop_word_path_ptr);
}

export function cut(str: string): string[] {
  if (moduleRef == 0) throw Error("jieba module not init or init failed");
  const str_ptr = constructorString(str);

  let result_assume_size = getStringLength(str) * 2;
  let result_ptr = Jieba._malloc(result_assume_size); // worst case each string have a sep
  while (Jieba._Cut(moduleRef, str_ptr, result_ptr, result_assume_size) == -1) {
    Jieba._free(result_ptr);
    result_assume_size *= 2;
    result_ptr = Jieba._malloc(result_assume_size);
  }
  const result = Jieba.UTF8ToString(result_ptr, result_assume_size);
  Jieba._free(result_ptr);
  destructorString(str_ptr);

  return result.split("/\\/\\");
}
