#!/usr/bin/env bash
set -euo pipefail

PROJECT="${PROJECT:-inner-cosmos}"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)"
SRC_DIR="${SCRIPT_DIR}/../errors"
DEST_DIR="/var/www/errors/${PROJECT}"

if [[ ! -d "$SRC_DIR" ]]; then
    echo "No errors dir: $SRC_DIR" >&2
    exit 1
fi

if [[ "$EUID" -ne 0 ]]; then
    sudo mkdir -p "$DEST_DIR"
    sudo rsync -a --delete "$SRC_DIR"/ "$DEST_DIR"/
else
    mkdir -p "$DEST_DIR"
    rsync -a --delete "$SRC_DIR"/ "$DEST_DIR"/
fi

echo "Installed error pages to $DEST_DIR"


