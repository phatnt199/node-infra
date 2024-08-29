#!/bin/sh

provision_opt=$1
case "$provision_opt" in
  "--major") yarn version $provision_opt ;;
  "--minor") yarn version $provision_opt ;;
  "--patch") yarn version $provision_opt ;;
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
