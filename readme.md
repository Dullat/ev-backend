# EV Backend

EV(name is not final), nor cool words to impress you. `yet`
                

---

## 🧩 Backend Tech Stack

| Layer                      | Tool               | Purpose                             |
| -------------------------- | ------------------ | ----------------------------------- |
| **Runtime**                | Node.js            | Server environment                  |
| **Framework**              | Express.js         | API framework                       |
| **Database**               | MongoDB (Atlas)    | Store stations, users, reviews      |
| **ODM**                    | Mongoose           | Schema modeling + ezzz CRUD         |
| **Authentication**         | JWT                | Secure login + role-based access    |
| **Image Hosting**          | Cloudinary or Supa | For station photos                  |

## 🧩 What about Frontend

Have several things in mind, not conformed but we will see that later...
And Frontend will be having a diff repo

#### Here some Sree Services
| Purpose                           | Free Alternative        |
| --------------------------------- | ----------------------- |
| Maps                              | Leaflet + OpenStreetMap |
| Places autocomplete               | Nominatim (OSM)         |
| Directions                        | OSRM public API         |
| Geocoding                         | Nominatim (OSM)         |



---

## 🧩 2. Backend Dependencies

Here’s the list of npm packages to install and why:

| Package                            | Purpose                                              |
| ---------------------------------- | ---------------------------------------------------- |
| **express**                        | Can't use Rust                                       |
| **mongoose**                       | MongoDB object modeling                              |
| **cors**                           | Allow frontend (React) to access backend             |
| **dotenv**                         | For environment variables                            |
| **bcryptjs**                       | Hashing passwords before storing                     |
| **jsonwebtoken**                   | Sign & verify JWT tokens                             |
| **socket.io**                      | Enable live updates for charger availability         |
| **multer**                         | Handle image uploads (before sending to Cloudinary)  |
| **cloudinary**                     | Cloud storage for images                             |

---

## ⚙️ Environment Variables

Use an `.env` file in the project root and add the vars:

```env
MONGO_URL=for now use mongodb locally
JWT_ACCESS_SECRET= some kay
JWT_REFRESH_SECRET= some key
NODE_ENV="development" for serving errorStack in Dev
````

---

## 🔐 Authentication Flow

Will make it secure by using a **dual JWT system**:

| Token         | Lifespan  | Stored           | Purpose                                  |
| ------------- | --------- | ---------------- | ---------------------------------------- |
| Access Token  | 5 minutes | HTTP-only cookie | Authenticates user for API requests      |
| Refresh Token | 7 days    | HTTP-only cookie | Provides new Ref Token, Path `api/auth`  |

---


## 🧭 API Routes (Planed, might change)

```pgsql
/api/
│
├── auth/
│   ├── POST /register
│   ├── POST /login
│   ├── GET  /me
│
├── users/
│   ├── GET  /me
│   ├── PATCH /update
│
├── stations/
│   ├── GET /               → list all stations
│   ├── GET /nearby         → query by coordinates
│   ├── GET /:id            → single station
│   ├── POST /              → add station (owner only)
│   ├── PATCH /:id          → update availability/details (owner only)
│   ├── DELETE /:id         → remove station (admin/owner)
│
└── reviews/
    ├── GET /station/:stationId
    ├── POST /station/:stationId


    Some Protected Routes be usig AuthMiddleware
```

---

## 📁 Project Current State

```
backend/
│
├── controllers/
│   |── auth.controller.js
|   └── user.controller.js  <-- done but routes are not set yet
│
├── models/
│   ├── user.model.js
│   └── userToken.model.js
│
├── middleware/
│   └── auth.middleware.js
│
├── routes/
│   └── auth.routes.js
│
├── utility/
│   └── genToken.js
│
├── errors/
│   ├── BadRequest.error.js
│   ├── InternalServer.error.js
│   └── Unauthenticated.error.js
│
├── server.js
└── .env
```

---



