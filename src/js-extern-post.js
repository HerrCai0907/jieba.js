Module["UTF8ToString"] = function (ptr, maxBytesToRead) {
  return UTF8ToString(ptr, maxBytesToRead);
};

Module["StringToUTF8"] = function (str, outPtr, maxBytesToWrite) {
  return stringToUTF8(str, outPtr, maxBytesToWrite);
};
