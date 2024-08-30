#!/bin/sh

provision_opt=$1
case "$provision_opt" in
  "--major") pnpm version major ;;
  "--minor") pnpm version minor ;;
  "--patch") pnpm version patch ;;
  "--no-version") echo "No versioning for current build!" ;;
  *)
    echo "Invalid versioning opts | Valid: [major | minor | patch | no-version]"
    exit 1
    ;;
esac

echo "\nCleaning up resources ..."
pnpm clean

echo "\nBuilding latest release..."
pnpm build

echo "\nPLEASE PUSH LATEST BUILT FOR ANY CHANGE(S)"
