#!/bin/sh
MM=`pwgen -1s`
CREATE_USER=1
CONFIG_FILE='/app/MrDoc/config/config.ini'

if [ ! -f $CONFIG_FILE ]; then
echo "#####Generating configuration file#####"
cat>"${CONFIG_FILE}"<<EOF
[site]
# True表示开启站点调试模式，False表示关闭站点调试模式
debug = False
[database]
# engine，指定数据库类型，接受sqlite、mysql、oracle、postgresql
engine = sqlite
[selenium]
driver_path = /usr/lib/chromium/chromedriver
# 详细配置请查阅 https://www.mrdoc.fun/project-1/doc-190/
EOF
else
        echo "#####Configuration file already exists#####"
fi

python /app/MrDoc/manage.py makemigrations && python /app/MrDoc/manage.py migrate && nohup echo y |python /app/MrDoc/manage.py rebuild_index &
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