# CS50W Capstone Project: PodPicker
Video demo: [YouTube](https://youtu.be/qyvniTlhPP4)

## Overview

This project is a web application for recommending and building podcast playlists.

Users indicate a target total duration, together with optional filters for publication date, languages, genres, or keywords. The app then searches the database and puts together a podcast playlist that matches these requirements.

The playlist builder and player can be accessed with or without an account. Logged-in users benefit from greater customization and history features.

## Distinctiveness and Complexity

The following elements distinguish this project from others in the course and contribute to its complexity:

- **[Backend] Django sessions**: Users can access the basic functionality without creating an account. Playlists created by guests are associated with their session keys and can be migrated to an account should the user decide to register or log in.
- **[Backend] GraphQL API**: Podcast data are sourced from [Taddy.org](https://taddy.org/developers), which uses a GraphQL API. Dynamic queries are used to perform custom searches based on users' input. The API calls are made via Python's `requests` library.
- **[Frontend] Object-oriented paradigm**: In the frontend JavaScript, custom classes are used to model podcast series, episodes, and playlists. Each class encapsulates the corresponding item's metadata and user interaction states, together with methods for rendering the DOM components, updating states, and communicating with the backend.

Additionally, the app also incorporates:

- Media playback
- UI design with automatic light/dark modes
- Mobile-responsive layout

For a more detailed description of how the project is designed and implemented, and specific decisions made or actions taken during that process, please refer to the [Implementation](#implementation) section below.

## How to Run

1. **Install requirements**: This project uses Django and the `requests` library.

        pip install -r requirements.txt

2. **Obtain Taddy API key**: An API key is needed to access the Taddy podcast API. [Create a free account](https://taddy.org/developers) to obtain an API key, and then export it in the terminal.

        export X_USER_ID=your_user_id
        export X_API_KEY=your_api_key

    Please note that this is required for the podcast search feature. If you attempt to use the app without an API key, you'll encounter an error page when performing a search.

3. **Apply migrations**

        python manage.py migrate

4. **Run server**: The app can now be run using the standard Django command.

        python manage.py runserver


## Implementation

### [Backend] Python - Django

The directory contains a Django project with a single app (`podpicker`).

As in other standard Django projects, the app directory contains the following Python scripts:

- **Routes and views**: As in other standard Django projects, the routes are defined in `urls.py`, and the views in `views.py`.

- **Models**: The models are defined in `models.py`. There are four models:

    - `User` (which extends Django's `AbstractUser`)
    - `PodcastSeries`
    - `PodcastEpisode`
    - `Playlist`

    Some custom model methods have been added to assist with data retrieval.

### [Backend] Python - Extra

Additional helper functions are defined in `utils.py`.

- **Fetching and processing API data**: The first function, `get_podcasts`, performs the following tasks:

    - Construct a GraphQL query based on user input
    - Call the API
    - Check the returned data and discard any items that don't match requirements

    For each of the resulting items, a copy of the received metadata is saved in the `PodcastSeries` and `PodcastEpisode` models. This is to avoid unnecessary API calls when the same information is needed again later on (e.g., to render a profile history page). Server-side storage of API data is explicitly permitted on Taddy's website.

- **Building podcast playlists**: The `pick_podcasts` function selects items from the resulting list to create a playlist with the desired total duration.

    A simple greedy algorithm is used in combination with a random shuffle. This ensures that different playlists can be generated from similar sets of search results (which are likely to occur when the same search query is performed multiple times in a short time span).

### [Frontend] HTML, CSS, JavaScript

#### Base components

The base elements and components that appear throughout the app are grouped into the following files.

- **JavaScript**: The `utils.js` file defines the core variables and classes that are used throughout the app.

    - **`PodcastSeries`**: Custom class for podcast series, including methods for:
        - Rendering and updating DOM elements
        - Generating a dialog for displaying detailed descriptions
        - Handling follow and block actions (via `fetch` requests to the backend)

    - **`PodcastEpisode`**: Custom class for podcast episodes, including methods for:
        - Rendering and updating DOM elements
        - Generating a dialog for displaying detailed descriptions
        - Handling finish and bookmark actions (via `fetch` requests to the backend)

    - **`Playlist`**: Custom class for podcast playlists

    - Some utility functions for generating duration strings and processing language and genre field values

- **HTML**: Besides the base layout, the `layout.html` template also contains templates for:

    - DOM elements for podcast series, episodes, and playlists

    - Dialog windows for displaying more detailed metadata and descriptions.

    These are contained within HTML `<template>` elements, which are not rendered by the browser but can be cloned and inserted via JavaScript when needed.

- **CSS**: The base styles for the app and its reusable components are defined in `global.css`.

#### Individual app functions

The remaining HTML, CSS, and JavaScript files serve to facilitate individual functionalities within the app.

- **Search**: The podcast search page doubles as the homepage for the app.

    The `picker-form.js` script populates the filter options and handles UI feedback when certain options are selected.

    The structure of the search page is defined in the `picker-form.html` template. Styles specific to this page are declared in `picker-form.css`.

- **Playlist building**: After submitting a search form, users will be shown a result page with the recommended playlist. They can customize the playlist by adding or removing items to their liking.

    The recommended playlist and a collection of alternative options are generated by the backend. The raw metadata is then injected into the template using the `json_script` template filter.

    The `picker-selection.js` script picks up the injected data and generates the corresponding DOM components. It also handles the actions of adding or removing items to/from the playlist by the user.

    `picker-selection.html` is the HTML template for this page. Styles specific to this page are declared in `picker-selection.css`.

- **Podcast player**: After creating a playlist, users are taken to a page where they can listen to the playlist.

    Again, the metadata for playback items are injected by the backend into the HTML template. The `player.js` script then retrieves the data and renders the DOM elements accordingly. It also contains functionality for basic playback toggles (play, pause, and skipping to other items in the playlist).

    The HTML template for this page is `player.html`, with page-specific styles declared in `player.css`.

- **Profile pages**: Logged-in users have access to a profile page that displays all playlists they've created. They can also browse lists of episodes they've finished listening to, episodes they've bookmarked, series they're following, and series they've blocked.

    Only a bare template is initially rendered when the page loads. The `profile.js` script then makes an asynchronous request to the backend to retrieve some data to populate the page.

    The profile pages use an infinite scrolling mechanism: when a user scrolls to the bottom of a page, an asynchronous JavaScript request is sent to the backend for more data to extend the list. This continues until there are no items left to show.

    The five separate profile pages (to display five different types of lists) all share the same template file, `profile.html`. Profile-specific styles are declared in `profile.css`.

- **Miscellaneous**: As their names suggest, `login.html`, `register.html`, and `error.html` are templates for user login/registration and error pages. Their styles are contained in `admin.css`.
