# vtfd


## Setup

1. Clone this repo into `CTFd/CTFd/themes`
2. `npm install` inside `CTFd/CTFd/themes/vtfd`
3. Change `docker-entrypoint.sh`, removing gunicorn and replacing with `exec flask run --host=0.0.0.0 --port=8000`

+ This disables caching on `manifest.json`

4. `docker-compose up --build` from `CTFd`
5. `npm run dev`