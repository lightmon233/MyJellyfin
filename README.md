# MyJellyfin
A minimal MIS system built to mimic Jellyfin's movie scraping features.

We use [Vite](https://vite.dev) + [React](https://react.dev) for frontend, and [NestJS](https://nestjs.com) for backend.

## Preview

![预览图](preview.pngjkv

## How to deploy

### 1. Clone this repository using `git clone`

```bash
git clone https://github.com/lightmon233/MyJellyfin.git
```

### 2. Change directory to frontend and backend to install node.js dependencies

```bash
# /frontend
npm install
```

```bash
# /backend
npm install
```

### 3. Create .env file under backend to connect to your database(postgres as ours) and file server(openresty or nginx as ours)

```bash
DB_HOST=<your_host_here>
DB_PORT=<your_port_here>
DB_USERNAME=<your_username_here>
DB_PASSWORD=<your_password_here>
DB_NAME=<your_name_here>

NGINX_HOST=<your_host_here>
TMDB_API_KEY=<your_api_key_here>
```

### 4. Go to frontend and backend directory to run service

```bash
# /frontend
npm run dev
```

```bash
# /backend
npm run start:dev
```

## Basic usage

#### Search Box
After entering the movie name you want to search for in the search box, press Enter to search all movies. The most relevant movie will be selected for download.

Filter Box
After entering text in the search box, the movies will be filtered based on matching titles.

#### Scrape Directory
Clicking this will prompt you to select a local directory. All first-level subfolders in the selected directory will be uploaded for scraping. Please note that each first-level subfolder must contain files to be uploaded.

#### Refresh Button
Click to retrieve data from the database and refresh the movie list.

#### Trash Icon
Click to delete all movies from the database and reflect this change in the display.