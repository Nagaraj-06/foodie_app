`npx prisma format`
If any change's made in schems.prisma -> `npx prisma generate`
migrate cmd : `npx prisma migrate dev --name <migration_name>`
seed cmd : `npx prisma db seed`

=> Use @unique Constraints for master table's name -> Instead Of using the HardCoding UUID directly into Our Code

Error: EPERM: operation not permitted (query_engine-windows.dll.node)
=> Delete node_modules, pakage_lock-json
=> npm i

To get the schema file from pg : `C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -U postgres -d my_database -n public -F p --column-inserts --no-owner -f "C:\backups\my_database_dump.sql`

=> After run this remove -> cmd this line => `-- CREATE SCHEMA public;`

`rm -rf node_modules package-lock.json`
for remove all old chaches : `git rm -r --cached .`

EPERM: operation not permitted
query_engine-windows.dll.node
👉 Windows is blocking Prisma from using that file.

Solution : 
Close everything:

Stop your server (Ctrl + C)

 -> Close VS Code
 -> Close terminal
 -> Then open terminal again and run:
 -> `npx prisma generate`


for kafka in `order-service`
 docker run --name zookeeper -p 2181:2181 zookeeper
 docker ps


1) docker-compose up -d
2) Fix: Added platform: linux/amd64 to the Kafka service to resolve the exec format error


cmd to Shows all topics in your Kafka broker
=> `kafka-topics --bootstrap-server localhost:9092 --list`


docker ps

run build from backend : `docker build -t auth-service -f services/auth-service/Dockerfile`
`docker run -p 3001:3001 auth-service`
`docker run -p 3001:3001 --env-file services/auth-service/.env auth-service`

`npx prisma db push`
`npx prisma migrate deploy`
`npx prisma db seed`


---------

Deployment steps (into AWS EC2)
refered : https://youtu.be/sdyT2BGP4y0?si=eJ4yyrQxOcMtJxtv

1) connect : `ssh -i "E:\Projects\AWS-Cloud\my-key.pem" ubuntu@13.126.96.49`
2) If any bad permision denies, “SSH requires private keys to have strict permissions. On Windows, inherited NTFS permissions can make the key accessible to other users, so we remove inheritance and restrict access to only our user.”
3) sudo apt update 
4) sudo apt install docker.io -y
5) check "whoami"
6) from sudo to normal : `sudo usermod -aG docker ubuntu` (logout, then re-connect)
7) `git clone REPO_NAME` (then we can see folder in ls) 
8) TO COPY THE ENV VARIABLE'S
i) `nano services/auth-service/.env` check ls -l services/auth-service/.env (if 0 -> use alternaticve way)
ii) use nano (when we have env file in folder) -> [otherwise use cat]
`cat <<EOF > <ENV_PATH_FROM_CURRENT_DIRECTORY>` => (then copy-paste env file - without double cots, include "EOF" - In last-line )
9) # 1. Build the image
`docker build -f services/auth-service/Dockerfile -t auth-service .`
10) # 2. Run the container
`docker run -d --name auth-service -p 3001:3001 --env-file services/auth-service/.env auth-service:latest`

*  Whenever u stop the ec2, only host-ip changes, after start the server (start the container)

To point the Duck-DNS(domain)
1) `mkdir -p ~/duckdns && cd ~/duckdns`
2) echo 'echo url="https://www.duckdns.org/update?domains=[YOUR_SUBDOMAIN_NAME]&token=[YOUR_TOKEN]&ip=" | curl -k -o ~/duckdns/duck.log -K -' > duck.sh
chmod 700 duck.sh
3) `cat duck.log` => responce "OK" it's working!
4) `crontab -e` => and add below (in last-line)
Set the Cron Job (whenever start server from stop) : `@reboot ~/duckdns/duck.sh >/dev/null 2>&1`

DOMAIN => `http://foodie-hub-app.duckdns.org:8000`
