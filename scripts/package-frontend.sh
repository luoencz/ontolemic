#!/usr/bin/env bash
set -euo pipefail

# Package the Next.js frontend build and required files into a tar.gz
# Archive is placed under artifacts/ and is ready for deployment.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}/.."
APP_DIR="${REPO_ROOT}/frontend"
ARTIFACTS_DIR="${REPO_ROOT}/artifacts"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
ARCHIVE_NAME="ontolemic-frontend-${TIMESTAMP}.tar.gz"

if [[ ! -d "${APP_DIR}" ]]; then
  echo "Error: frontend directory not found at ${APP_DIR}" >&2
  exit 1
fi

mkdir -p "${ARTIFACTS_DIR}"

# Ensure a production build exists; build if missing
if [[ ! -d "${APP_DIR}/.next" || ! -f "${APP_DIR}/.next/BUILD_ID" ]]; then
  echo "No production build detected in frontend/.next. Running build..."
  (cd "${APP_DIR}" && \
    npm ci; npm run build)
fi

# Compose inclusion list
INCLUDE_PATHS=(
  ".next"
  "package.json"
  "public"
)

# Optionally include commonly-used configs if present
OPTIONAL_PATHS=(
  "package-lock.json"
  "next.config.ts"
  "next.config.mjs"
  "tailwind.config.ts"
  "tailwind.config.js"
  "postcss.config.mjs"
  "postcss.config.js"
  "tsconfig.json"
  "next-env.d.ts"
  "README.md"
)

for p in "${OPTIONAL_PATHS[@]}"; do
  if [[ -e "${APP_DIR}/${p}" ]]; then
    INCLUDE_PATHS+=("${p}")
  fi
done

ARCHIVE_PATH="${ARTIFACTS_DIR}/${ARCHIVE_NAME}"

echo "Creating archive ${ARCHIVE_PATH}"
tar -czf "${ARCHIVE_PATH}" -C "${APP_DIR}" "${INCLUDE_PATHS[@]}"

echo "Package created: ${ARCHIVE_PATH}"
echo "Contents (top-level):"
tar -tzf "${ARCHIVE_PATH}" | awk -F/ '{print $1}' | sort -u


