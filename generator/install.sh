#!/bin/sh
#
# Installer for "generator" generated .js files
# Add script to crontab if it doesn't already exist
#
# H. Dahle

PWD=`pwd`

# must use eval for tilde-expansion to work...dirty
TMPDIR=$(mktemp -d)
LOGDIR=`eval echo ~${USER}/log`
SCRIPT="generator.sh"
LOGFILE="${LOGDIR}/generator.log"
NEWCRONTAB="${TMPDIR}/crontab"
echo "Logs are in ${LOGDIR}"

# check if log directory exists
if [ ! -d "${LOGDIR}" ]; then
    echo "Creating ${LOGDIR}"
    mkdir ${LOGDIR} 
    if [ ! -d "${LOGDIR}" ]; then
      echo "Could not create ${LOGDIR} - aborting"
      exit
    else
      echo "Logdir created"
    fi
else
  echo "Using logfile: ${LOGFILE}"
fi

# make sure script exists
if [ -f "${PWD}/${SCRIPT}" ]; then
  echo "Shell script found: ${PWD}/${SCRIPT}"
else
  echo "Not found: ${PWD}/${SCRIPT} - aborting"
  exit
fi

# make new crontab entry: twice daily
NEWENTRY="55 1,13 * * * cd ${PWD} && ${PWD}/${SCRIPT} >> ${LOGFILE} 2>&1 && cp redis*.js ../js/ && cp plot*.js ../js/"
echo "Crontab entry will be: ${NEWENTRY}"

# test if new entry already exists
crontab -l > ${NEWCRONTAB}
EXISTENTRY=`grep -F "${NEWENTRY}" < ${NEWCRONTAB}`

# add to crontab
if [ "${EXISTENTRY}" = "${NEWENTRY}"  ]; then
  echo "Already in crontab"
  exit
fi

echo -n "Add to Crontab (y/n)? "
read ANSWER

if [ "${ANSWER}" != "${ANSWER#[Yy]}" ] ;then
    echo Yes
else
    echo No
    exit
fi

echo "Adding new entry to crontab"
echo "${NEWENTRY}" >> ${NEWCRONTAB}
crontab ${NEWCRONTAB}



