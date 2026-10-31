#!/bin/sh
set -eu

: "${VITE_API_URL:?VITE_API_URL is required}"
: "${VITE_ADMIN_ACCOUNT_HOLDER_KO:?VITE_ADMIN_ACCOUNT_HOLDER_KO is required}"
: "${VITE_ADMIN_ACCOUNT_HOLDER_EN:?VITE_ADMIN_ACCOUNT_HOLDER_EN is required}"

# Escape "<" so a value can never close the inline script tag.
RUNTIME_CONFIG=$(jq -rn 'env | with_entries(select(.key | startswith("VITE_"))) | tojson | gsub("<"; "\\u003c")')
export RUNTIME_CONFIG

# Rewrite the body of <script id="runtime-config"> in every HTML document.
# Replacing the body rather than a placeholder keeps container restarts idempotent.
injected=0
for html in $(find /usr/share/nginx/html -name '*.html'); do
  grep -q '<script id="runtime-config">' "$html" || continue
  awk '
    BEGIN { open_tag = "<script id=\"runtime-config\">"; close_tag = "</script>" }
    {
      output = ""
      rest = $0
      while ((start = index(rest, open_tag)) > 0) {
        output = output substr(rest, 1, start - 1 + length(open_tag))
        rest = substr(rest, start + length(open_tag))
        output = output "window.__RUNTIME_CONFIG__=" ENVIRON["RUNTIME_CONFIG"] ";"
        rest = substr(rest, index(rest, close_tag))
      }
      print output rest
    }
  ' "$html" > "$html.tmp"
  mv "$html.tmp" "$html"
  injected=$((injected + 1))
done

if [ "$injected" -eq 0 ]; then
  echo "runtime-config: no HTML document contains the runtime config script" >&2
  exit 1
fi
