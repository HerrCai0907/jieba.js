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
BINARYEN_API cppjieba::Jieba *init(const char *DICT_PATH, const char *HMM_PATH, const char *USER_DICT_PATH,
                                   const char *IDF_PATH, const char *STOP_WORD_PATH);
BINARYEN_API uint32_t cut(cppjieba::Jieba *module, const char *str, uint8_t *result, uint32_t length);
BINARYEN_API uint32_t extract(cppjieba::Jieba *module, const char *str, uint32_t top, uint8_t *results,
                              uint32_t maxLength, double *weights);
#ifdef __cplusplus
}
#endif