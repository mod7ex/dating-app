sudo rm -Rf logs
rm -Rf uploads
mkdir logs
mkdir uploads
touch logs/requests.log
touch logs/errors.log

echo 'log files have been reset'
echo 'uploads folder has been reset'

node reset.js

echo 'database has been reset'