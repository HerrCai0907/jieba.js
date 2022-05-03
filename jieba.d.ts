type Ref = number;
type stringRef = number;
type moduleRef = number;

type CppWasmType = {
  asm: any;
  _malloc: (size: number) => Ref;
  _free: (ptr: Ref) => void;

  UTF8ToString: (ptr: Ref, maxSize: number) => string;
  StringToUTF8: (str: string, ptr: Ref, maxSize: number) => void;
};

export type JiebaType = {
  _Init: (
    dict_path: stringRef,
    hmm_path: stringRef,
    user_dict_path: stringRef,
    idf_path: stringRef,
    stop_word_path: stringRef
  ) => moduleRef;
  _Cut: (module: moduleRef, str: stringRef, result: stringRef, length: number) => number;
} & CppWasmType;

export let Jieba: JiebaType;
