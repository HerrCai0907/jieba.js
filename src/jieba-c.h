#pragma once

#include "cppjieba/Jieba.hpp"

#if defined(__EMSCRIPTEN__)
#include <emscripten.h>
#define BINARYEN_API EMSCRIPTEN_KEEPALIVE
#elif defined(_MSC_VER) && !defined(BUILD_STATIC_LIBRARY)
#define BINARYEN_API __declspec(dllexport)
#else
#define BINARYEN_API
#endif

#ifdef __cplusplus
extern "C" {
#endif
BINARYEN_API cppjieba::Jieba *Init(const char *DICT_PATH, const char *HMM_PATH, const char *USER_DICT_PATH,
                                   const char *IDF_PATH, const char *STOP_WORD_PATH);
BINARYEN_API uint32_t Cut(cppjieba::Jieba *module, const char *str, char *result, uint32_t length);
BINARYEN_API int Test();

#ifdef __cplusplus
}
#endif