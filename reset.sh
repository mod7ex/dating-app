rm -Rf logs
mkdir logs
touch logs/requests.log
touch logs/errors.log

echo 'log files have been reset'

node reset.js

echo 'database has been reset'