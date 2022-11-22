#!/bin/bash
set +e
RELEASE_ID=$(md5 -q js/utils.js)

sed -i '' "s/utils_.*.js/utils_${RELEASE_ID}.js/g" *.html
git mv -k js/utils_* js/utils_${RELEASE_ID}.js


