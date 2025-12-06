cmake_minimum_required(VERSION 3.10)
project(OpenQoEWorker CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)
set(CMAKE_BUILD_TYPE Release)

# --- Find the system-installed package ---
find_package(PkgConfig REQUIRED)
pkg_check_modules(Pistache REQUIRED IMPORTED_TARGET libpistache)
# -----------------------------------------

# Define the source files for your application
add_executable(${PROJECT_NAME}
    src/main_server.cpp
    src/item_handler.cpp
)

# Link against the target provided by the system package
target_link_libraries(${PROJECT_NAME}
    PkgConfig::Pistache
)
