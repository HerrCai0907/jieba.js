#include "./jieba-c.h"
#include "cppjieba/Jieba.hpp"
#include <cstddef>
#include <cstdint>
#include <cstring>
#include <fstream>
#include <iostream>
#include <string>
#include <vector>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

const char *const DICT_PATH = "assert/jieba.dict.utf8";
const char *const HMM_PATH = "assert/hmm_model.utf8";
const char *const USER_DICT_PATH = "assert/user.dict.utf8";
const char *const IDF_PATH = "assert/idf.utf8";
const char *const STOP_WORD_PATH = "assert/stop_words.utf8";

cppjieba::Jieba *Init(const char *dict_path, const char *hmm_path, const char *user_dict_path, const char *idf_path,
                      const char *stop_word_path) {
  dict_path = dict_path == NULL ? DICT_PATH : dict_path;
  hmm_path = hmm_path == NULL ? HMM_PATH : hmm_path;
  user_dict_path = user_dict_path == NULL ? USER_DICT_PATH : user_dict_path;
  idf_path = idf_path == NULL ? IDF_PATH : idf_path;
  stop_word_path = stop_word_path == NULL ? STOP_WORD_PATH : stop_word_path;
  return new cppjieba::Jieba(dict_path, hmm_path, user_dict_path, idf_path, stop_word_path);
}

uint32_t Cut(cppjieba::Jieba *module, const char *str, char *result, uint32_t length) {
  std::vector<std::string> words{};
  module->Cut(str, words, true);
  // std::cout << "[cpp] input string is " << str << "\n";
  auto joinedWords = limonp::Join(words.begin(), words.end(), "/\\/\\");
  if (joinedWords.size() > length) { return -1; }
  std::memcpy(result, joinedWords.data(), joinedWords.size());
  result[joinedWords.size()] = '\0';
  // std::cout << "[cpp] output string is " << result << " in " << reinterpret_cast<uint64_t>(result) << "\n";
  return joinedWords.size();
}

int Test() { return 250; }
