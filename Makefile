build:
	docker build -t vejersele/todo .

test:
	docker-compose build
	docker-compose down --remove-orphans
	docker-compose up -d
	docker-compose run web npm test
	docker-compose down --remove-orphans
