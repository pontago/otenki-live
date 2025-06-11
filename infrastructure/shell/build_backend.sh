#!/bin/sh

set -eu

if [[ $# != 2 ]]; then
  echo "Must provide 2 arguments."
  exit 1
fi

SILENT="-q"
BACKEND_DIR=$(realpath $1)
OUTPUT_DIR=$(realpath $2)

cd "${BACKEND_DIR}"
uv $SILENT export --frozen --no-dev --no-editable -o requirements.txt
uv $SILENT pip install --no-installer-metadata --no-compile-bytecode --upgrade --python-platform x86_64-manylinux_2_28 --python 3.13 -r requirements.txt --target "${OUTPUT_DIR%/}/packages"

jq -n --arg backend_dir "${OUTPUT_DIR%/}/packages" '{"backend_dir":$backend_dir}'

exit 0