# binaryen.js
#
# Note that we can't emit binaryen.js directly, as there is libbinaryen already
# declared earlier, so we create jieba_wasm/js.js, which must then be copied.
# Note that SHELL: is needed as otherwise cmake will coalesce -s link flags in
# an incorrect way for emscripten.
if(EMSCRIPTEN)
  # binaryen.js JavaScript variant
  add_executable(jieba_js jieba-c.cpp)
  target_link_libraries(jieba_js "-s WASM=0")
  # target_link_libraries(jieba_js "-s WASM_ASYNC_COMPILATION=0")
  # if(${CMAKE_CXX_COMPILER_VERSION} STREQUAL "6.0.1") # only valid with
  # fastcomp and WASM=0 target_link_libraries(jieba_js "-s
  # ELIMINATE_DUPLICATE_FUNCTIONS=1") endif()
  target_link_libraries(jieba_js "-s NO_FILESYSTEM=0")
  target_link_libraries(jieba_js "-s NODERAWFS=0")
  target_link_libraries(jieba_js "-s EXPORT_NAME=Jieba")
  target_link_libraries(jieba_js "-s TOTAL_MEMORY=67108864")
  # target_link_libraries(jieba_js "-s EXPORT_ES6=0")
  target_link_libraries(
    jieba_js "--extern-pre-js ${CMAKE_CURRENT_SOURCE_DIR}/js-extern-pre.js")
  target_link_libraries(
    jieba_js "--post-js ${CMAKE_CURRENT_SOURCE_DIR}/js-extern-post.js")
  target_link_libraries(
    jieba_js
    "--embed-file ${CMAKE_CURRENT_SOURCE_DIR}/../deps/cppjieba/dict/hmm_model.utf8@assert/hmm_model.utf8"
  )
  target_link_libraries(
    jieba_js
    "--embed-file ${CMAKE_CURRENT_SOURCE_DIR}/../deps/cppjieba/dict/idf.utf8@assert/idf.utf8"
  )
  target_link_libraries(
    jieba_js
    "--embed-file ${CMAKE_CURRENT_SOURCE_DIR}/../deps/cppjieba/dict/jieba.dict.utf8@assert/jieba.dict.utf8"
  )
  target_link_libraries(
    jieba_js
    "--embed-file ${CMAKE_CURRENT_SOURCE_DIR}/../deps/cppjieba/dict/stop_words.utf8@assert/stop_words.utf8"
  )
  target_link_libraries(
    jieba_js
    "--embed-file ${CMAKE_CURRENT_SOURCE_DIR}/../deps/cppjieba/dict/user.dict.utf8@assert/user.dict.utf8"
  )
  target_link_libraries(jieba_js optimized "--closure 1")
  target_link_libraries(jieba_js optimized "--closure-args
  \"--language_in=ECMASCRIPT6 --language_out=ECMASCRIPT6\"")
  target_link_libraries(jieba_js optimized "-flto")
  # target_link_libraries(jieba_js debug "--profiling")
  # target_link_libraries(jieba_js debug "-s ASSERTIONS")
endif()
