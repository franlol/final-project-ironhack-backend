# Project Name

## Description

Application where the user can post needs and other users can apply.

## User Stories

-  **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
-  **Signup:** As an anon I can sign up in the platform so that I can start sharing my services and getting help in my needs
-  **Login:** As a user I can login to the platform so that I can start sharing my services and getting help in my needs
-  **Logout:** As a user I can logout from the platform

//User
-  **Add a need** As a user I can add a need so that I can share it with the community and others can offer their services
-  **Have a profile** As a user I want to have a profile, so that others can check me.
-  **Check my needs** As a user I want to check my needs, so I can see if some worker applied to them
-  **Check my applies** As a user I want to check my applies, so that I can track my applies

//Worker
-  **Search needs** As a worker I want to search needs
-  **List of needs** As a worker, I want to see all the needs to apply in those that interest me
-  **Apply** As a worker, I want to apply to those needs than I can solve

## Backlog

User profile:
- Map
- Finish rate system

## Models

User model

```
username: String
email: String
password: String
profession: String
description: String
telephone: Number
photo: String
rating: Number
rate: Number
jobsDone: Number
```

Needs model

```
owner: ObjectID <ref: User>
title: String
rate: Number
tags: Array
description: String
isActive: Boolean
waitingNotification: Number
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