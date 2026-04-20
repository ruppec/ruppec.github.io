#!/bin/sh
set -ex
icons="mail-outline logo-github menu-outline"
dest=assets/ionicons
url=https://unpkg.com/ionicons/dist/svg
mkdir -p "${dest}"
for icon in $icons; do
  icon="${icon}.svg"
  wget -O "${dest}/${icon}" "${url}/${icon}"
done
