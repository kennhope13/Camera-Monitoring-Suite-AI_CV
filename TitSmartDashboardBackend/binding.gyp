{
  "targets": [
    {
      "target_name": "hikvision",
      "sources": [ "src/addon/main.cpp" ],
      "include_dirs": [
        "node_modules/node-addon-api",
        "sdk/include"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "link_settings": {
        "libraries": [
          "-Wl,-rpath,'$$ORIGIN/../../sdk/lib'",
          "-L../sdk/lib",
          "-lhcnetsdk"
        ]
      }
    }
  ]
}
