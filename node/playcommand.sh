#!/bin/bash

vid=$1
display_user="$(who | grep ':0.0' | cut -d ' ' -f 1)"

export XAUTHORITY=/home/$display_user/.Xauthority
export DISPLAY=:0
lxterminal -e "omxplayer $vid" && xrefresh
