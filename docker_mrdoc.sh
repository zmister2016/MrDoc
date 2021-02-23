#!/bin/sh
python /app/MrDoc/manage.py makemigrations && python /app/MrDoc/manage.py migrate && echo y |python /app/MrDoc/manage.py rebuild_index
MM=`pwgen -1s`
CREATE_USER=1
if [ $CREATE_USER -eq 1 ]; then
  if [ ! -e $CREATE_USER ]; then
	    touch $CREATE_USER
	    echo "-- First container startup --user:${USER} pwd:${MM}"
            echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('${USER}', 'www@mrdoc.fun', '${MM}')" | python /app/MrDoc/manage.py shell
		    # YOUR_JUST_ONCE_LOGIC_HERE
	    else
		        echo "-- Not first container startup --"
  fi

else
	        echo "user switch not create"

fi


python -u /app/MrDoc/manage.py runserver --noreload 0.0.0.0:${LISTEN_PORT}
exec "$@"