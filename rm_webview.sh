#!/bin/bash

echo '--- START: Removing WebView files from react-native dependency.'

BASE_DIR=`pwd`;
function remove_rctwebview(){
    
    local dir="${BASE_DIR}/node_modules/react-native/React";
 
    sed -i'.bak' '/RCTWebView/d' "${dir}/React.xcodeproj/project.pbxproj"
    rm -f "${dir}/React.xcodeproj/project.pbxproj.bak"
    rm -f "${dir}/Views/RCTWebView.m"
    rm -f "${dir}/Views/RCTWebView.h"
    rm -f "${dir}/Views/RCTWebViewManager.m"
    rm -f "${dir}/Views/RCTWebViewManager.h"
}
 
remove_rctwebview;
echo '--- END: Removing WebView files from react-native dependency.'