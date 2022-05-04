type Ref = number;
type StringRef = number;
type DoubleRef = number;
type ModuleRef = number;

type CppWasmType = {
  asm: any;
  _malloc: (size: number) => Ref;
  _free: (ptr: Ref) => void;

  UTF8ToString: (ptr: Ref, maxSize: number) => string;
  StringToUTF8: (str: string, ptr: Ref, maxSize: number) => void;

  HEAPF64: Float64Array
};

export type JiebaType = {
  _init: (
    dict_path: StringRef,
    hmm_path: StringRef,
    user_dict_path: StringRef,
    idf_path: StringRef,
    stop_word_path: StringRef
  ) => ModuleRef;

  _cut: (module: ModuleRef, str: StringRef, results: StringRef, maxLength: number) => number;

  _extract: (
    module: ModuleRef,
    str: StringRef,
    top: number,
    results: StringRef,
    maxLength: number,
    weights: DoubleRef
  ) => number;
} & CppWasmType;

export let Jieba: JiebaType;
