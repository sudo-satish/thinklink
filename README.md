# How to start
1. Copy `.env.example` in a new file `.env`.
2. Spin containers using following command
```bash
docker-compose up
```
3. Then visit [http://localhost:8000](http://localhost:8000)

### Framework used
[NestJS](https://docs.nestjs.com/)

### Database used
[MongoDB](https://www.mongodb.com/docs/)

## How to start adding routes?
1. MongoDB schemas are in `src/db/schemas` folder
2. Controllers are in `/src/controllers` folder
3. Services are in `/src/services` folder

## Where is the schedular?
It is in `/src/services/TasksService.ts`.

## How to access mongodb express?
Visit `http://localhost:8081`

# BIG NOTE
Date saved in DB is GMT +0000 Which may give look like a bug to you if are testing it at GMT +0530. This needs to be fixed later.