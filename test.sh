#!/bin/sh

# Verify that files served by web-server match the project files
# 
# H. Dahle 2020

RETVAL=1
HOST="localhost"

for f in "index.html" "js/app.js" "js/dom.js" "css/w3.css"
do
  echo "Downloading ${f} from ${HOST}"
  RESULT=`curl -s http://${HOST}/${f} | diff -s ${f} -`
  EXPECTED_RESULT="Files ${f} and - are identical"

  if [ "${RESULT}" = "${EXPECTED_RESULT}" ]; then
    echo "Success ${f}"
  else
    echo "Failure ${f}"
    RETVAL=0
  fi

done

exit ${RETVAL}

