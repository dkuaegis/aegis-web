#!/usr/bin/env bash
set -euo pipefail

: "${COOLIFY_URL:?GitHub Environment secret COOLIFY_URL is required}"
: "${COOLIFY_APP_UUID:?GitHub Environment secret COOLIFY_APP_UUID is required}"
: "${COOLIFY_WRITE_TOKEN:?GitHub Environment secret COOLIFY_WRITE_TOKEN is required}"
: "${COOLIFY_DEPLOY_TOKEN:?GitHub Environment secret COOLIFY_DEPLOY_TOKEN is required}"
: "${WAF_DEPLOY_TOKEN:?GitHub Environment secret WAF_DEPLOY_TOKEN is required}"
: "${IMAGE_REPOSITORY:?Built image repository is required}"
: "${IMAGE_TAG:?Built image tag is required}"

api_url="${COOLIFY_URL%/}/api/v1"
image_update="$(jq -n \
  --arg name "$IMAGE_REPOSITORY" \
  --arg tag "$IMAGE_TAG" \
  '{docker_registry_image_name: $name, docker_registry_image_tag: $tag}')"
temporary_directory="$(mktemp -d)"
trap 'rm -rf "$temporary_directory"' EXIT

print_sanitized_body() {
  python3 - "$1" <<'PY'
from html import escape
from pathlib import Path
from urllib.parse import quote, quote_plus
import json
import os
import sys

body = Path(sys.argv[1]).read_bytes()[:4096].decode("utf-8", errors="replace")
for key in (
    "COOLIFY_URL",
    "COOLIFY_WRITE_TOKEN",
    "COOLIFY_DEPLOY_TOKEN",
    "WAF_DEPLOY_TOKEN",
):
    value = os.environ.get(key, "")
    if not value:
        continue
    escaped_values = {
        value,
        quote(value, safe=""),
        quote_plus(value),
        json.dumps(value)[1:-1],
        escape(value),
        escape(value, quote=True),
    }
    for secret in escaped_values:
        if secret:
            body = body.replace(secret, "[REDACTED]")
body = "".join(
    character if character in "\n\t" or ord(character) >= 32 else " "
    for character in body
)
print("Response body (limited to 4096 bytes):")
print(body)
PY
}

request() {
  local method="$1"
  local request_url="$2"
  local authorization_token="$3"
  local response_file="$temporary_directory/response"
  local status=""
  local curl_exit=0
  local -a curl_args=(
    --silent
    --connect-timeout 10
    --max-time 30
    --output "$response_file"
    --write-out "%{http_code}"
    --request "$method"
    "$request_url"
    --header "Authorization: Bearer $authorization_token"
    --header "X-Aegis-Deploy-Token: $WAF_DEPLOY_TOKEN"
  )

  if [[ "$method" == "PATCH" ]]; then
    curl_args+=(
      --header "Content-Type: application/json"
      --data "$image_update"
    )
  fi

  if status="$(curl "${curl_args[@]}" 2>/dev/null)"; then
    curl_exit=0
  else
    curl_exit=$?
  fi
  if [[ ! "$status" =~ ^[0-9]{3}$ ]]; then
    status="000"
  fi

  if ((curl_exit != 0)); then
    printf 'Coolify %s request failed (HTTP %s, curl exit %s).\n' \
      "$method" "$status" "$curl_exit" >&2
    if [[ -s "$response_file" ]]; then
      print_sanitized_body "$response_file" >&2
    fi
    return 1
  fi

  if [[ ! "$status" =~ ^2[0-9]{2}$ ]]; then
    printf 'Coolify %s request failed (HTTP %s).\n' "$method" "$status" >&2
    if [[ -s "$response_file" ]]; then
      print_sanitized_body "$response_file" >&2
    fi
    return 1
  fi

  printf 'Coolify %s request succeeded (HTTP %s).\n' "$method" "$status"
}

request \
  PATCH \
  "$api_url/applications/$COOLIFY_APP_UUID" \
  "$COOLIFY_WRITE_TOKEN"
request \
  POST \
  "$api_url/deploy?uuid=$COOLIFY_APP_UUID" \
  "$COOLIFY_DEPLOY_TOKEN"
