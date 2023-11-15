#!/bin/bash

if [ -z "$BITBUCKET_BRANCH" ]; then
  git checkout staging
else
  git checkout "$BITBUCKET_BRANCH"
fi

