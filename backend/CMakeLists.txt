cmake_minimum_required(VERSION 3.8 FATAL_ERROR)
project(ChatBackend LANGUAGES C CXX)

set(CMAKE_CXX_FLAGS_RELEASE "-O3 -DNDEBUG -frtti")
set(CMAKE_CXX_FLAGS_DEBUG "-g")

include(FetchContent)

FetchContent_Declare(cpr GIT_REPOSITORY https://github.com/libcpr/cpr.git GIT_TAG origin/master)
FetchContent_MakeAvailable(cpr)

FetchContent_Declare(nlohmann_json GIT_REPOSITORY https://github.com/nlohmann/json.git GIT_TAG origin/master)
FetchContent_MakeAvailable(nlohmann_json)

find_package(Drogon REQUIRED)

add_executable(ChatBackend
    main.cpp
    routes/test/test.cpp
    routes/chat/chat.cpp
)

set_target_properties(ChatBackend PROPERTIES CXX_STANDARD 17)

target_link_libraries(ChatBackend PRIVATE 
    Drogon::Drogon 
    cpr::cpr
)

target_include_directories(ChatBackend PRIVATE ${nlohmann_json_SOURCE_DIR}/single_include)