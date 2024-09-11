# SPA_Application

<!-- ABOUT -->
> The Comments Project is a web-based comment
> management application where users can post
> comments and respond to comments from other users.
<!-- END ABOUT -->

<hr>

<h2>📍How to up: </h2>

- Clone
- Set your value in `.env` file in (backend & frontend) folder, look `.env.example`
- Command to build and up:  `docker compose -f docker/docker-compose.yml up --build`

<!-- ADDITIONALLY -->
<details><summary><h2>🗂️Additional Information:</h2></summary><br/>

Applying `fixtures`

- `docker exec -it django-container bash`
- `first_start/first_start.sh` apply fixtures

### Default user credentials

- username -> `admin`
- password -> `admin`

</details>
<!-- END ADDITIONALLY -->

# Endpoints

- **GET** `http://localhost:8000/`: (Backend)Home page
- **GET** `http://localhost:5173/`: (Frontend)Home page

For both of them

- **POST** `/comment_create/`: Comment creation
- **GET, PUT, PATCH, DELETE** `/comment/<id>`: Comment detail info
- **GET** `/comments_list/`: List of comment


- **POST** `/token/`: Create JWT
- **POST** `/token/refresh/`: Refresh JWT

