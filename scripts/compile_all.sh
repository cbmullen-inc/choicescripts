#!/bin/env bash

for dir in games/*/; do 
    game=$(basename "$dir")
    make compile GAME_NAME="$game"
done