#!/bin/env bash

# Exit script on any error
set -e

# Check Variables
env_vars=(GAME_NAME ACTION)

for var in "${env_vars[@]}"; do
    if [ -z "${!var}" ]; then 
        printf "Please define the %s environment variable\\n" "${var}"
        exit 1
    fi
done

# Check locations.
SRC_LOCATION=".\\choicescript_src"
TEMP_LOCATION="${SRC_LOCATION}\\web\\mygame\\scenes"
GAME_LOCATION=".\\games\\${GAME_NAME}\\scenes"

dirs=("${GAME_LOCATION}" "${SRC_LOCATION}" "${TEMP_LOCATION}")

for dir in "${dirs[@]}"; do
    if [ ! -d "${dir}" ]; then 
        printf "Directory %s not found\\n" "${dir}"
        exit 1
    fi
done

# Copy your game into the choicescript_src, as it has all the boilerplate
rm -r "${TEMP_LOCATION}"
cp -r "${GAME_LOCATION}" "${TEMP_LOCATION}"

# Are we compiling?
if [ "${ACTION}" == "compile" ]; then
    cd "${SRC_LOCATION}" && node compile "..\\games\\${GAME_NAME}\\index.html"
fi

# Are we running random tests?
if [ "${ACTION}" == "randomtest" ]; then
    cd "${SRC_LOCATION}" && node randomtest
fi

# Are we running quick tests?
if [ "${ACTION}" == "quicktest" ]; then
    cd "${SRC_LOCATION}" && node quicktest
fi
