# DOCKER
rebuild: images down rmi build # rebuild images 
	@echo "🐳 Docker images rebuilt..."
build: # build image
	docker compose build dev
restart: down up # restart and add new changes
up: # turn on the server
	docker compose up dev
down: # turn off the server
	docker compose down
images: # show images related to gates
	docker images | grep gates
rmi:
	docker rmi -f gates-gis-chat-app-dev 	
# SCREEN 
scl: # show available screen
	screen -ls
rcc: # connect to gatesclient screen
	screen -r gateschat
scgc:
	screen -S gateschat

major:	
	$(MAKE) major
minor:
	$(MAKE) minor
patch:
	$(MAKE) patch