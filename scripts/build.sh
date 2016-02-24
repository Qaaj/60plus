#!/usr/bin/env bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'

NC='\033[0m' # No Color


printf "${YELLOW} > Cleaning the build folder...${NC}\n"
rm -rf build dist

printf "${YELLOW} > Building the server files...${NC}\n"
babel src -d build --source-maps --ignore src/client

printf "${YELLOW} > Copying the config files...${NC}\n"
mkdir build/server/config/
cp src/server/config/*.json build/server/config/

printf "${YELLOW} > Copying the views...${NC}\n"
mkdir build/server/views/
cp src/server/views/*.jade build/server/views/

printf "${GREEN} >>> Done.${NC}\n"
