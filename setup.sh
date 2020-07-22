# Make sure the package manager is updated
sudo apt-get update &&
# Upgrade any pre-existing utilities
sudo apt-get upgrade -y &&
# Install necessary requirements
sudo apt-get install apache2 libapache2-mod-php mariadb-server php-mysql python-certbot-apache certbot git -y &&
# Remove unnecessary packages
sudoo apt autoremove -y;
# Generate the certificate, this part will require some interaction
sudo certbot --apache -d www.octalbyte.com,octalbyte.com &&
# Make a crontab and add automatic certbot updates to sudo crontab
(sudo crontab -l 2>/dev/null; echo "15 3 * * * sudo certbot --apache renew --quiet" ) | sudo crontab -;
# Change director to html folder
cd /var/www/html;
# Set all files to be read/right/execute by anyone
sudo chmod --recursive 777 .;
# Clone the latest working github version
git clone https://github.com/adamfuller/MiniPiApacheWebServer;
# Move files into html folder
mv MiniPiApacheWebServer/* ./;
# Move git files not caught by * to html folder
mv MiniPiApacheWebServer/.git ./;
mv MiniPiApacheWebServer/.gitignore ./;
# Change who owns the files so that the pull.php webhook works on pushes
sudo chgrp -R www-data .;
sudo chmod -R g+rwx .;
# TODO Find a way to replace "Options Indexes FollowSymLinks" with "Options FollowSymLinks"
sed "s/Options Indexes FollowSymLinks/Options FollowSymLinks/g" /etc/apache2/apache2.conf > temp.txt;
mv /etc/apache2/temp.txt /etc/apache2/apache2.conf;