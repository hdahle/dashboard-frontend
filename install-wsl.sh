#!/bin/sh

# move files to WSL/Ubuntu Apache HTML folder

sudo cp index.html /var/www/html/
sudo cp js/app.js /var/www/html/js/
sudo cp js/dom.js /var/www/html/js/
sudo cp js/redis-values.js /var/www/html/js/
sudo cp css/*.css /var/www/html/css/
sudo cp favicon.ico /var/www/html
sudo cp eco-mark.svg /var/www/html
sudo cp img/* /var/www/html/img/

