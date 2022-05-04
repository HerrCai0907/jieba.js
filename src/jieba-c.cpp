#include "./jieba-c.h"
#include "cppjieba/Jieba.hpp"
#include <cstddef>
#include <cstdint>
#include <cstring>
#include <fstream>
#include <iostream>
#include <stdexcept>
#include <string>
#include <sys/types.h>
#include <vector>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

const char *const DICT_PATH = "assert/jieba.dict.utf8";
const char *const HMM_PATH = "assert/hmm_model.utf8";
const char *const USER_DICT_PATH = "assert/user.dict.utf8";
const char *const IDF_PATH = "assert/idf.utf8";
const char *const STOP_WORD_PATH = "assert/stop_words.utf8";

cppjieba::Jieba *init(const char *dictPath, const char *hmmPath, const char *userDictPath, const char *idfPath,
                      const char *stopWordPath) {
  dictPath = dictPath == nullptr ? DICT_PATH : dictPath;
  hmmPath = hmmPath == nullptr ? HMM_PATH : hmmPath;
  userDictPath = userDictPath == nullptr ? USER_DICT_PATH : userDictPath;
  idfPath = idfPath == nullptr ? IDF_PATH : idfPath;
  stopWordPath = stopWordPath == nullptr ? STOP_WORD_PATH : stopWordPath;
  return new cppjieba::Jieba(dictPath, hmmPath, userDictPath, idfPath, stopWordPath);
}

uint32_t cut(cppjieba::Jieba *module, const char *str, uint8_t *results, uint32_t maxLength) {
  std::vector<std::string> words{};
  module->Cut(str, words, true);
  uint32_t usedSize = 0;
  for (const auto &word : words) {
    if (usedSize + word.size() + 1 > maxLength) { return -1; }
    std::memcpy(&results[usedSize], word.data(), word.size());
    usedSize += word.size();
    results[usedSize] = '/';
    usedSize++;
  }
  results[usedSize - 1] = 0;
  return usedSize;
}

uint32_t extract(cppjieba::Jieba *module, const char *str, uint32_t top, uint8_t *results, uint32_t maxLength,
                 double *weights) {
  std::vector<cppjieba::KeywordExtractor::Word> keywordres;
  module->extractor.Extract(str, keywordres, top);
  uint32_t usedSize = 0;
  for (const auto &keyword : keywordres) {
    if (usedSize + keyword.word.size() + 1 > maxLength) { return -1; }
    std::memcpy(&results[usedSize], keyword.word.data(), keyword.word.size());
    usedSize += keyword.word.size();
    results[usedSize] = '/';
    usedSize++;
  }
  results[usedSize - 1] = 0;
  if (weights != nullptr) {
    uint32_t i = 0;
    for (const auto &keyword : keywordres) {
      weights[i] = keyword.weight;
      i++;
    }
  }
  return 0;
}
