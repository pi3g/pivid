#! /bin/sh
### BEGIN INIT INFO
# Provides:          pivid
# Required-Start:    
# Required-Stop:     
# Should-Start:      networking
# Should-Stop:       networking
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Control PiVid as a daemon.
### END INIT INFO


DAEMON=/usr/bin/pivid
test -x $DAEMON || exit 0

. /lib/lsb/init-functions

case "$1" in
	start|"")
		log_daemon_msg "Starting PiVid" "pivid"
		start-stop-daemon --quiet --start --name pivid --background --exec $DAEMON || echo -n " already running"
                log_end_msg $?
		;;
	reload|force-reload)
		echo "Error: argument '$1' not supported" >&2
		exit 3
		;;
	stop)
		log_daemon_msg "Stopping PiVid" "pivid"
		start-stop-daemon --quiet --stop --name pivid --retry 5
		log_end_msg $?
		;;
	status)
		status_of_proc /usr/bin/node pivid && exit 0 || exit $?
		;;
	restart)
		$0 stop
		sleep 1
		$0 start
		;;
	*)
		echo "Usage: pivid.sh [start|stop|restart]" >&2
		exit 3
		;;
esac
