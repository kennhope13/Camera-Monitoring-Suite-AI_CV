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
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS", "_CRT_SECURE_NO_WARNINGS" ],
      "conditions": [
        ['OS=="win"', {
          "link_settings": {
            "libraries": [
              "-l../sdk/lib/HCNetSDK.lib"
            ]
          },
          "msvs_settings": {
            "VCCLCompilerTool": { "ExceptionHandling": 1 }
          }
        }],
        ['OS=="linux"', {
          "cflags!": [ "-fno-exceptions" ],
          "cflags_cc!": [ "-fno-exceptions" ],
          "link_settings": {
            "libraries": [
              "-Wl,-rpath,'$$ORIGIN/../../sdk/lib'",
              "-L../sdk/lib",
              "-lhcnetsdk"
            ]
          }
        }]
      ]
    }
  ]
}
