#!/usr/bin/env bash
#
# Starts the calories-tracker backend (NestJS) and frontend (Vite) together.
# Both run in this terminal with prefixed output; Ctrl+C stops both.
#
set -euo pipefail

# Job control: each background service becomes its own process group,
# so we can signal the whole tree (npm -> nest/vite -> node) on exit.
set -m

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)/calories-tracker-backend"

if [ ! -d "$BACKEND_DIR" ]; then
  echo "Backend folder not found at: $BACKEND_DIR" >&2
  exit 1
fi

GREEN=$'\033[32m'; CYAN=$'\033[36m'; RESET=$'\033[0m'

pids=()

stop_group() {
  local pid="$1" sig="$2"
  kill "-$sig" "-$pid" 2>/dev/null || kill "-$sig" "$pid" 2>/dev/null || true
}

cleanup() {
  trap - INT TERM EXIT
  echo ""
  echo "Shutting down..."

  local pid
  for pid in ${pids[@]+"${pids[@]}"}; do
    stop_group "$pid" TERM
  done

  # Give them a few seconds to exit cleanly, then force-kill survivors.
  local i alive
  for i in 1 2 3 4 5 6 7 8 9 10; do
    alive=0
    for pid in ${pids[@]+"${pids[@]}"}; do
      kill -0 "$pid" 2>/dev/null && alive=1
    done
    [ "$alive" -eq 0 ] && break
    sleep 0.5
  done
  for pid in ${pids[@]+"${pids[@]}"}; do
    kill -0 "$pid" 2>/dev/null && stop_group "$pid" KILL
  done

  wait 2>/dev/null || true
}
trap cleanup INT TERM EXIT

install_deps_if_needed() {
  local dir="$1" name="$2"
  if [ ! -d "$dir/node_modules" ]; then
    echo "Installing $name dependencies..."
    (cd "$dir" && npm install)
  fi
}

# Runs one service, prefixing every output line with its name.
# Kept as tiny wrappers so bash's job-control messages stay short and readable.
run_prefixed() {
  local dir="$1" name="$2" color="$3"
  shift 3
  cd "$dir"
  "$@" 2>&1 | while IFS= read -r line; do
    printf '%s[%s]%s %s\n' "$color" "$name" "$RESET" "$line"
  done
}

backend()  { run_prefixed "$BACKEND_DIR"  backend  "$GREEN" npm run start; }
frontend() { run_prefixed "$FRONTEND_DIR" frontend "$CYAN"  npm run dev; }

install_deps_if_needed "$BACKEND_DIR" "backend"
install_deps_if_needed "$FRONTEND_DIR" "frontend"

echo "Starting backend:  $BACKEND_DIR (npm run start)"
backend &
pids+=("$!")

echo "Starting frontend: $FRONTEND_DIR (npm run dev)"
frontend &
pids+=("$!")

echo "Both services are running. Press Ctrl+C to stop."

# Exit as soon as either service dies; the EXIT trap stops the other one.
wait -n 2>/dev/null || wait
