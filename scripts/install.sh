#!/usr/bin/env bash
# Install dsh-cyberpunk-workbench into the DSH web profile.
# Uses a node_modules symlink (no pnpm needed). Idempotent.
# Step 3 (restart "dsh web") is manual.
set -euo pipefail

PLUGIN_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DSH_HOME_ROOT="${DSH_HOME:-$HOME/.dsh}"
PROFILE="${DSH_WEB_PROFILE:-$DSH_HOME_ROOT/profiles/web}"
PATCH="$PROFILE/cordis.patch.yml"

echo "==> 1/2  link plugin into profile node_modules: $PLUGIN_DIR"
mkdir -p "$PROFILE/node_modules"
LINK="$PROFILE/node_modules/dsh-cyberpunk-workbench"
if [ -L "$LINK" ] && [ "$(readlink "$LINK")" = "$PLUGIN_DIR" ]; then
  echo "    already linked -> $PLUGIN_DIR"
elif [ -L "$LINK" ]; then
  OLD_TARGET="$(readlink "$LINK")"
  ln -sfn "$PLUGIN_DIR" "$LINK"
  echo "    relinked $OLD_TARGET -> $PLUGIN_DIR"
elif [ -e "$LINK" ]; then
  echo "    refusing to replace existing non-symlink path: $LINK" >&2
  exit 1
else
  ln -s "$PLUGIN_DIR" "$LINK"
  echo "    linked -> $LINK"
fi

echo "==> 2/2  register cordis row"
if [ ! -f "$PATCH" ]; then
  mkdir -p "$(dirname "$PATCH")"
  printf '%s\n' '- insert:' '    - id: cyberpunk-workbench' '      name: dsh-cyberpunk-workbench' > "$PATCH"
  echo "    created $PATCH"
elif [ "$(grep -c 'name: dsh-cyberpunk-workbench' "$PATCH" || true)" -gt 1 ]; then
  echo "    refusing duplicate plugin entries in $PATCH" >&2
  exit 1
elif grep -q 'name: dsh-cyberpunk-workbench' "$PATCH"; then
  echo "    already registered"
else
  printf '\n%s\n' '- insert:' '    - id: cyberpunk-workbench' '      name: dsh-cyberpunk-workbench' >> "$PATCH"
  echo "    appended insert row"
fi

echo ""
echo "==> done. Now restart the web server:"
echo "       dsh web"
echo "    then hard-refresh http://127.0.0.1:3080"
