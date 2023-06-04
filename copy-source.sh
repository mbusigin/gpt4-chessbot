#!/bin/sh

echo "The following is a code-base for gpt4-chessbot:"
echo
echo
find src/ public/ -name '*.*' -print0 | xargs -0 -I{} sh -c 'echo {}; echo "==================================" ; echo; echo ; cat {} ; echo'
echo
echo
echo "Understand gpt4-chessbot's code base. And just tell me you acknowledge -- nothing else."
