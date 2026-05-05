cmake_minimum_required(VERSION 3.5)
project(TitSmartDashboard LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Tự động xử lý các file đặc thù của Qt
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

# Tìm thư viện Qt5 (Widgets là phần chứa giao diện)
find_package(Qt5 COMPONENTS Widgets REQUIRED)

# Thêm đường dẫn đến header file của HCNetSDK
include_directories(${CMAKE_SOURCE_DIR}/../incEn)

# Thêm đường dẫn đến thư viện .so của HCNetSDK
link_directories(${CMAKE_SOURCE_DIR}/../lib)

# Thêm mã nguồn vào project
add_executable(TitSmartDashboard
    main.cpp
    MainWindow.cpp
    MainWindow.h
)

# Liên kết với thư viện Qt và HCNetSDK
target_link_libraries(TitSmartDashboard PRIVATE
    Qt5::Widgets
    hcnetsdk
    HCCore
    PlayCtrl
    ssl
    crypto
)
