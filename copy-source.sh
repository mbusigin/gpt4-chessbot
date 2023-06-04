#!/bin/sh

echo "The following is a code-base for gpt4-chessbot:"
echo
echo
find src/ public/ -type f -not \( -name '*.css' -or -name '*.svg' -or -name '*.scss' -or -name '*.map' \) -print0 | xargs -0 -I{} sh -c 'echo {}; echo "==================================" ; echo; echo ; cat {} ; echo'
echo
echo
echo "Understand gpt4-chessbot's code base. And just tell me you acknowledge -- nothing else."
