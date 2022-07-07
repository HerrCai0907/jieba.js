if(EMSCRIPTEN)
  add_executable(jieba jieba-c.cpp)
  target_link_libraries(jieba "-s NODERAWFS=0")
  target_link_libraries(jieba "-s EXPORT_NAME=Jieba")
  target_link_libraries(jieba "-s TOTAL_MEMORY=33554432")
  target_link_libraries(jieba "-s EXPORT_ES6=0")
  target_link_libraries(jieba "-s ENVIRONMENT=web")
  target_link_libraries(
    jieba "--extern-pre-js ${CMAKE_CURRENT_SOURCE_DIR}/js-extern-pre.js")
  target_link_libraries(
    jieba "--post-js ${CMAKE_CURRENT_SOURCE_DIR}/js-extern-post.js")
  target_link_libraries(
    jieba
    "--embed-file ${CMAKE_CURRENT_SOURCE_DIR}/../deps/cppjieba/dict/hmm_model.utf8@assert/hmm_model.utf8"
  )
  target_link_libraries(
    jieba
    "--embed-file ${CMAKE_CURRENT_SOURCE_DIR}/../deps/cppjieba/dict/idf.utf8@assert/idf.utf8"
  )
  target_link_libraries(
    jieba
    "--embed-file ${CMAKE_CURRENT_SOURCE_DIR}/../deps/cppjieba/dict/jieba.dict.utf8@assert/jieba.dict.utf8"
  )
  target_link_libraries(
    jieba
    "--embed-file ${CMAKE_CURRENT_SOURCE_DIR}/../deps/cppjieba/dict/stop_words.utf8@assert/stop_words.utf8"
  )
  target_link_libraries(
    jieba
    "--embed-file ${CMAKE_CURRENT_SOURCE_DIR}/../deps/cppjieba/dict/user.dict.utf8@assert/user.dict.utf8"
  )
  target_link_libraries(jieba optimized "--closure 1")
  target_link_libraries(jieba optimized "--closure-args
  \"--language_in=ECMASCRIPT6 --language_out=ECMASCRIPT6\"")
  target_link_libraries(jieba optimized "-flto")
endif()
