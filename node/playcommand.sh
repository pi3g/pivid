#!/bin/bash

vid=$1

export DISPLAY=:0
lxterminal -e "omxplayer $vid" && xrefresh
