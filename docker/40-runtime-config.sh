#!/bin/sh
set -eu

: "${VITE_API_URL:?VITE_API_URL is required}"
: "${VITE_PRESIDENT_NAME_KO:?VITE_PRESIDENT_NAME_KO is required}"
: "${VITE_PRESIDENT_NAME_EN:?VITE_PRESIDENT_NAME_EN is required}"
: "${VITE_PRESIDENT_PHONE:?VITE_PRESIDENT_PHONE is required}"
: "${VITE_ADMIN_ACCOUNT_HOLDER_KO:?VITE_ADMIN_ACCOUNT_HOLDER_KO is required}"
: "${VITE_ADMIN_ACCOUNT_HOLDER_EN:?VITE_ADMIN_ACCOUNT_HOLDER_EN is required}"

config=$(jq -cn 'env | with_entries(select(.key | startswith("VITE_")))')
output=/usr/share/nginx/html/runtime-config.js
temporary_output="${output}.tmp"
printf 'window.__RUNTIME_CONFIG__ = %s;\n' "$config" > "$temporary_output"
mv "$temporary_output" "$output"
