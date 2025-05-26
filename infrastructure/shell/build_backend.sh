#!/bin/sh

set -eu

if [[ $# != 1 ]]; then
  echo "Must provide 1 arguments: BACKEND_DIR"
  exit 1
fi

SILENT="-q"
BACKEND_DIR=$(realpath $1)

cd "${BACKEND_DIR}"
uv $SILENT export --frozen --no-dev --no-editable -o requirements.txt
uv $SILENT pip install --no-installer-metadata --no-compile-bytecode --python-platform x86_64-manylinux2014 --python 3.13 -r requirements.txt --target packages

jq -n --arg backend_dir "${BACKEND_DIR%/}/packages" '{"backend_dir":$backend_dir}'

exit 0