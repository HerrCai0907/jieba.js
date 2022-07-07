Module["UTF8ToString"] = function (ptr, maxBytesToRead) {
  return UTF8ToString(ptr, maxBytesToRead);
};

Module["StringToUTF8"] = function (str, outPtr, maxBytesToWrite) {
  return stringToUTF8(str, outPtr, maxBytesToWrite);
};

let moduleRef = 0;

function getStringLength(str) {
  return str.length * 4 + 1;
}
function constructorString(str) {
  const len = getStringLength(str);
  const ptr = Module._malloc(len);
  Module.StringToUTF8(str, ptr, len);
  return ptr;
}
function destructorString(ptr) {
  if (ptr != 0) Module._free(ptr);
}

export function ready() {
  return new Promise(resolve => {
    const tryLoad = () => {
      setTimeout(() => {
        if (Module.asm == undefined) {
          tryLoad();
        } else {
          resolve();
        }
      }, 10);
    };
    tryLoad();
  });
}

export function init(dictPath, hmmPath, userDictPath, idfPath, stopWordPath) {
  if (Module.asm == undefined) throw Error("Module wasm not load, please call 'ready' first");
  const dict_path_ptr = dictPath == null ? 0 : constructorString(dictPath);
  const hmm_path_ptr = hmmPath == null ? 0 : constructorString(hmmPath);
  const user_dict_path_ptr = userDictPath == null ? 0 : constructorString(userDictPath);
  const idf_path_ptr = idfPath == null ? 0 : constructorString(idfPath);
  const stop_word_path_ptr = stopWordPath == null ? 0 : constructorString(stopWordPath);
  moduleRef = Module._init(dict_path_ptr, hmm_path_ptr, user_dict_path_ptr, idf_path_ptr, stop_word_path_ptr);
  destructorString(dict_path_ptr);
  destructorString(hmm_path_ptr);
  destructorString(user_dict_path_ptr);
  destructorString(idf_path_ptr);
  destructorString(stop_word_path_ptr);
}

export function extract(str, topN) {
  if (moduleRef == 0) throw Error("Module module not init or init failed");
  const strRef = constructorString(str);

  let resultAssumeSize = topN * 40;
  let resultRef = Module._malloc(resultAssumeSize); // worst case each string have a sep

  let weightsRef = Module._malloc(topN * 8); // each double 8 bytes

  while (Module._extract(moduleRef, strRef, topN, resultRef, resultAssumeSize, weightsRef) == -1) {
    Module._free(resultRef);
    resultAssumeSize *= 2;
    resultRef = Module._malloc(resultAssumeSize);
  }

  const words = Module.UTF8ToString(resultRef, resultAssumeSize).split("/");

  const res = words.map((word, index) => {
    const weight = Module.HEAPF64[(weightsRef >> 3) + index];
    return { word, weight };
  });

  Module._free(weightsRef);
  Module._free(resultRef);
  destructorString(strRef);

  return res;
}

export function cut(str) {
  if (moduleRef == 0) throw Error("Module module not init or init failed");
  const strRef = constructorString(str);

  let resultAssumeSize = getStringLength(str) * 2;
  let resultRef = Module._malloc(resultAssumeSize); // worst case each string have a sep
  while (Module._cut(moduleRef, strRef, resultRef, resultAssumeSize) == -1) {
    Module._free(resultRef);
    resultAssumeSize *= 2;
    resultRef = Module._malloc(resultAssumeSize);
  }
  const result = Module.UTF8ToString(resultRef, resultAssumeSize).split("/");

  Module._free(resultRef);
  destructorString(strRef);

  return result;
}
