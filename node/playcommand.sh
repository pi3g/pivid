#!/bin/bash

vid=$1
export DISPLAY=:0.0

# this function gets the display owner from console kit via dbus
# it's needed sometimes because lightdm doesn't properly register logins
ck_display_user() {
	session="$(dbus-send --system --type=method_call --print-reply=literal --dest=org.freedesktop.ConsoleKit /org/freedesktop/ConsoleKit/Seat1 org.freedesktop.ConsoleKit.Seat.GetActiveSession)"
	ruid="$(dbus-send --system --type=method_call --print-reply=literal --dest=org.freedesktop.ConsoleKit $session org.freedesktop.ConsoleKit.Session.GetUser)"
	user="$(getent passwd ${ruid:10} | cut -d: -f1)"
	echo $user
}

# get the display owner and permission to use it
echo "acquiring display"
display_user="$(who | grep ':0.0' | cut -d ' ' -f 1)"
if [ -z "$display_user" ]
then
	display_user="$(ck_display_user)"
fi
if [ -z "$display_user" ]
then
	echo "WARNING: display owner not found"
else
	export XAUTHORITY=/home/$display_user/.Xauthority
fi

echo "running player"
lxterminal -e "omxplayer $vid" && xrefresh
echo "done"
