# Healthcare Appointment Scheduling System

## [Basic System Desin](https://ali-akkas.notion.site/Healthcare-Appointment-Scheduling-System-cf67ead3bb1947f58f505c18fb886280?pvs=4)


## Overview
- The Healthcare Appointment Scheduling System employs a microservices architecture with Docker containers for modularization and scalability.
- CI/CD pipelines ensure automated and reliable deployment of updates and features.
- RabbitMQ enables asynchronous communication between services, enhancing system resilience and responsiveness.
- Redis caching optimizes performance by storing patient data and appointment schedules, reducing database load and latency.
- Rate limiting mechanisms manage system load and prevent overload, ensuring stability and responsiveness.
- A custom API gateway facilitates secure and efficient communication between services, providing features like authentication and request routing.

## Technologies Used

- [Node.js](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express.js](https://expressjs.com/) - Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- [Typescript](https://www.typescriptlang.org/) - TypeScript extends JavaScript by adding types to the language.
- [Zod](https://zod.dev/) - Zod is a TypeScript-first schema declaration and validation library.
- [PostgreSQL](https://www.postgresql.org/) - PostgreSQL, also known as Postgres, is a free and open-source relational database management system emphasizing extensibility and SQL compliance.
- [Prisma](https://www.prisma.io/) - Open source Node.js and TypeScript ORM with a readable data model, automated migrations, type-safety, and auto-completion.
- [Docker](https://www.docker.com/) - Docker is a platform designed to help developers build, share, and run container applications.
- [Redis](https://redis.io/) - Redis is a source-available, in-memory storage, used as a distributed, in-memory key–value database, cache and message broker, with optional durability.
- [RabbitMQ](https://www.rabbitmq.com/) - RabbitMQ is another widely used open source message broker, employed by several companies worldwide.

## File Structure

```
Healthcare-Appointment-Scheduling-System/
├── .github
├── api-gateway
└── services/
        ├── auth       
        ├── user        
        ├── email
        ├── appointment
        ├── notification
```

## Setup
follow .env.example file for setup environment variables

### Run the `Docker Container`
```bash
docker-compose up
```

### Run the `Tests`
```
yarn run test .\tests\**\**\*
```

