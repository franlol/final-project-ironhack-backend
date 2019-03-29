# Project Name

## Description

Post your services and get help by others.

## User Stories

-  **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
-  **Signup:** As an anon I can sign up in the platform so that I can start sharing my services and getting help in my needs
-  **Login:** As a user I can login to the platform so that I can start sharing my services and getting help in my needs
-  **Logout:** As a user I can logout from the platform so no one else can use it

//User
-  **Add a need** As a user I can add a need so that I can share it with the community and others can offer their services
-  **Have a profile** As a user I want to have a profile, so others can check me.
-  **Check my needs** As a user I want to check my needs, so I can see if some worker applied to them

//Worker
-  **Search needs** As a worker I want to search needs and chat with owner
-  **List of needs** As a worker, I want to see all the needs to apply in those that interest me
-  **Apply** As a worker, I want to apply to those needs than I can solve

## Backlog

User profile:
- user photo
- map?
  
# Server

## Models

User model

```
username - String // required
email - String // required & unique
Profesion - String //required
description - String //required
photo - String
password - String // required
rating: Numeric
jobsDone: []

favorites - [ObjectID<Needs>]
applies: [ObjectId<Needs>]
needsDone - [ObjectId<Needs>]
```

Needs model

```
owner - ObjectID<User> //required
title - String //required
categories - [String] - required
description - String //required
price - Numeric
applicants - [ObjectId<User>]
doneBy - ObjectId<User>
coords - 2d
status - Boolean
```


## API Endpoints/Backend Routes

//AUTH

- GET /auth/login

- POST /auth/login
  - body:
    - username
    - password

- GET /auth/signup

- POST /auth/signup
  - body:
    - username
    - email
    - profession
    - password
    - createdAt

- POST /auth/logout
  - body: (empty)


//NEEDS

- GET /needs
    - query (?category=)

- GET /needs/:id


- PUT /needs/:id
    - body:
        - title
        - description
        - price

- POST /needs
    - body:
        - owner
        - title
        - description
        - price
        - applicants []
        - doneBy []
        - coords
        - status 1 (active)

- DELETE /needs:id
    - (empty)

### Git

The url to your repository and to your deployed project

[Client repository Link](http://github.com)
[Server repository Link](http://github.com)

[Deploy Link](http://heroku.com)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)