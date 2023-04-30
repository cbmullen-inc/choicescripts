#!/bin/env bash

for dir in games/*/; do 
    game=$(basename "$dir")
    make quicktest GAME_NAME="$game"
done