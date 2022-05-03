cmake_minimum_required(VERSION 3.10.2)
project(jieba_js)

set(CMAKE_EXPORT_COMPILE_COMMANDS on)

function(add_link_flag value)
  message(STATUS "Linking with ${value}")
  foreach(variable CMAKE_EXE_LINKER_FLAGS CMAKE_SHARED_LINKER_FLAGS)
    set(${variable}
        "${${variable}} ${value}"
        PARENT_SCOPE)
  endforeach(variable)
endfunction()
function(add_compile_flag value)
  message(STATUS "Building with ${value}")
  foreach(variable CMAKE_C_FLAGS CMAKE_CXX_FLAGS)
    set(${variable}
        "${${variable}} ${value}"
        PARENT_SCOPE)
  endforeach(variable)
endfunction()

if(EMSCRIPTEN)
  # link with -O3 for metadce and other powerful optimizations. note that we
  # must use add_link_options so that this appears after CMake's default -O2
  add_link_options("-O3")
  add_link_flag("-s SINGLE_FILE")
  add_link_flag("-s ALLOW_MEMORY_GROWTH=1")
  add_compile_flag("-s DISABLE_EXCEPTION_CATCHING=0")
  add_link_flag("-s DISABLE_EXCEPTION_CATCHING=0")
  # make the tools immediately usable on Node.js
  add_link_flag("-s NODERAWFS")
  # in opt builds, LTO helps so much (>20%) it's worth slow compile times
else()
  message(FATAL_ERROR "please use emcmake cmake ..")
endif()

set(cppjiebarepo ${PROJECT_SOURCE_DIR}/deps/cppjieba)
include_directories(${cppjiebarepo}/deps ${cppjiebarepo}/include)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

add_subdirectory(src)
