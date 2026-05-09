#include <napi.h>
#include <iostream>
#include "HCNetSDK.h"
#include <map>
#include <mutex>
#include <string.h>

std::map<LONG, Napi::ThreadSafeFunction> tsfnMap;
std::mutex tsfnMutex;

// Structure to hold data for thread-safe function
struct StreamData {
    BYTE* buffer;
    DWORD size;
    DWORD type;
};

// Callback from Hikvision SDK when stream data arrives
void CALLBACK g_RealDataCallBack_V30(LONG lRealHandle, DWORD dwDataType, BYTE *pBuffer, DWORD dwBufSize, void *pUser) {
    if (dwDataType == NET_DVR_SYSHEAD || dwDataType == NET_DVR_STREAMDATA) {
        std::lock_guard<std::mutex> lock(tsfnMutex);
        auto it = tsfnMap.find(lRealHandle);
        if (it != tsfnMap.end()) {
            Napi::ThreadSafeFunction tsfn = it->second;
            
            // Copy buffer to pass to JS
            StreamData* data = new StreamData;
            data->size = dwBufSize;
            data->type = dwDataType;
            data->buffer = new BYTE[dwBufSize];
            memcpy(data->buffer, pBuffer, dwBufSize);
            
            auto callback = [](Napi::Env env, Napi::Function jsCallback, StreamData* data) {
                if (env != nullptr && jsCallback != nullptr) {
                    Napi::Buffer<BYTE> jsBuffer = Napi::Buffer<BYTE>::Copy(env, data->buffer, data->size);
                    Napi::Number jsType = Napi::Number::New(env, data->type);
                    jsCallback.Call({jsType, jsBuffer});
                }
                delete[] data->buffer;
                delete data;
            };
            
            tsfn.BlockingCall(data, callback);
        }
    }
}


// Define a simple function to initialize the SDK
Napi::Value InitSDK(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    bool initResult = NET_DVR_Init();
    if (!initResult) {
        std::cerr << "NET_DVR_Init failed, error code: " << NET_DVR_GetLastError() << std::endl;
        return Napi::Boolean::New(env, false);
    }
    
    // Set connection timeout and reconnect time
    NET_DVR_SetConnectTime(2000, 1);
    NET_DVR_SetReconnect(10000, true);
    
    return Napi::Boolean::New(env, true);
}

Napi::Value CleanupSDK(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    bool cleanupResult = NET_DVR_Cleanup();
    return Napi::Boolean::New(env, cleanupResult);
}

Napi::Value GetLastError(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    int errorCode = NET_DVR_GetLastError();
    return Napi::Number::New(env, errorCode);
}

Napi::Value Login(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 4 || !info[0].IsString() || !info[1].IsNumber() || !info[2].IsString() || !info[3].IsString()) {
        Napi::TypeError::New(env, "String ip, Number port, String user, String pass expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string ip = info[0].As<Napi::String>().Utf8Value();
    int port = info[1].As<Napi::Number>().Int32Value();
    std::string user = info[2].As<Napi::String>().Utf8Value();
    std::string pass = info[3].As<Napi::String>().Utf8Value();

    NET_DVR_USER_LOGIN_INFO loginInfo = {0};
    NET_DVR_DEVICEINFO_V40 deviceInfo = {0};

    strcpy(loginInfo.sDeviceAddress, ip.c_str());
    loginInfo.wPort = port;
    strcpy(loginInfo.sUserName, user.c_str());
    strcpy(loginInfo.sPassword, pass.c_str());
    loginInfo.bUseAsynLogin = 0; // Synchronous login

    int userId = NET_DVR_Login_V40(&loginInfo, &deviceInfo);
    
    if (userId < 0) {
        std::cerr << "Login failed for " << ip << ", error code: " << NET_DVR_GetLastError() << std::endl;
    }

    return Napi::Number::New(env, userId);
}

Napi::Value Logout(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number userId expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    int userId = info[0].As<Napi::Number>().Int32Value();
    bool result = NET_DVR_Logout(userId);

    return Napi::Boolean::New(env, result);
}

Napi::Value StartStream(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 3 || !info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsFunction()) {
        Napi::TypeError::New(env, "Number userId, Number channel, Function callback expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    LONG userId = info[0].As<Napi::Number>().Int32Value();
    LONG channel = info[1].As<Napi::Number>().Int32Value();
    Napi::Function cb = info[2].As<Napi::Function>();

    NET_DVR_PREVIEWINFO previewInfo = {0};
    previewInfo.lChannel = channel;
    previewInfo.dwStreamType = 0; // 0-Main stream, 1-Sub stream
    previewInfo.dwLinkMode = 0;   // 0-TCP mode, 1-UDP mode
    previewInfo.hPlayWnd = NULL;  // No window, we just want data
    previewInfo.bBlocked = 1;     // Blocked/Synchronous

    LONG realHandle = NET_DVR_RealPlay_V40(userId, &previewInfo, g_RealDataCallBack_V30, NULL);

    if (realHandle < 0) {
        std::cerr << "NET_DVR_RealPlay_V40 failed, error code: " << NET_DVR_GetLastError() << std::endl;
        return Napi::Number::New(env, -1);
    }

    // Create a ThreadSafeFunction
    Napi::ThreadSafeFunction tsfn = Napi::ThreadSafeFunction::New(
        env,
        cb,
        "StreamCallback",
        0,
        1
    );

    {
        std::lock_guard<std::mutex> lock(tsfnMutex);
        tsfnMap[realHandle] = tsfn;
    }

    return Napi::Number::New(env, realHandle);
}

Napi::Value StopStream(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number realHandle expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    LONG realHandle = info[0].As<Napi::Number>().Int32Value();

    bool result = NET_DVR_StopRealPlay(realHandle);

    if (result) {
        std::lock_guard<std::mutex> lock(tsfnMutex);
        auto it = tsfnMap.find(realHandle);
        if (it != tsfnMap.end()) {
            it->second.Release();
            tsfnMap.erase(it);
        }
    }

    return Napi::Boolean::New(env, result);
}


// Initialize the Addon module mapping C++ functions to JS
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "initSDK"), Napi::Function::New(env, InitSDK));
    exports.Set(Napi::String::New(env, "cleanupSDK"), Napi::Function::New(env, CleanupSDK));
    exports.Set(Napi::String::New(env, "getLastError"), Napi::Function::New(env, GetLastError));
    exports.Set(Napi::String::New(env, "login"), Napi::Function::New(env, Login));
    exports.Set(Napi::String::New(env, "logout"), Napi::Function::New(env, Logout));
    exports.Set(Napi::String::New(env, "startStream"), Napi::Function::New(env, StartStream));
    exports.Set(Napi::String::New(env, "stopStream"), Napi::Function::New(env, StopStream));
    return exports;
}

NODE_API_MODULE(hikvision, Init)
