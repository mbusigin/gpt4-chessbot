#!/bin/sh
echo "Here's a specification for this project:"
echo
echo '```'
cat src/prompts/specification.txt
echo '```'
echo
echo "Analyze the source-code, and compare it to the specification. Identify the steps remaining to completion."
