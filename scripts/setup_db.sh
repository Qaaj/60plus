#!/usr/bin/env bash

# Create postgres user
createuser -s -d -R -e -w 60plus

# Create postgres db
createdb 60plus
