(function() {
    // Process list of language options
    function processLanguages() {
        const languageCodes = [
            'ABKHAZIAN', 'AFAR', 'AFRIKAANS', 'AKAN', 'ALBANIAN', 'AMHARIC', 'ARABIC', 'ARAGONESE',
            'ARMENIAN', 'ASSAMESE', 'AVARIC', 'AVESTAN', 'AYMARA', 'AZERBAIJANI', 'BAMBARA', 'BASHKIR',
            'BASQUE', 'BELARUSIAN', 'BENGALI', 'BIHARI_LANGUAGES', 'BISLAMA', 'BOSNIAN', 'BRETON',
            'BULGARIAN', 'BURMESE', 'CENTRAL_KHMER', 'CHAMORRO', 'CHECHEN', 'CHICHEWA_CHEWA_NYANJA',
            'CHINESE', 'CHURCH_SLAVONIC', 'CHUVASH', 'CORNISH', 'CORSICAN', 'CREE', 'CROATIAN', 'CZECH',
            'DANISH', 'DHIVEHI_MALDIVIAN', 'DUTCH_FLEMISH', 'DZONGKHA', 'ENGLISH', 'ESPERANTO', 'ESTONIAN',
            'EWE', 'FAROESE', 'FARSI', 'FIJIAN', 'FINNISH', 'FRENCH', 'FULAH', 'GAELIC', 'GALICIAN',
            'GANDA', 'GEORGIAN', 'GERMAN', 'GIKUYU', 'GREEK', 'GUARANI', 'GUJARATI', 'HAITIAN_CREOLE',
            'HAUSA', 'HEBREW', 'HERERO', 'HINDI', 'HIRI_MOTU', 'HUNGARIAN', 'ICELANDIC', 'IDO', 'IGBO',
            'INDONESIAN', 'INTERLINGUA', 'INTERLINGUE_OCCIDENTAL', 'INUKTITUT', 'INUPIAQ', 'IRISH',
            'ITALIAN', 'JAPANESE', 'JAVANESE', 'KALAALLISUT_GREENLANDIC', 'KANNADA', 'KANURI', 'KASHMIRI',
            'KAZAKH', 'KINYARWANDA', 'KOMI', 'KONGO', 'KOREAN', 'KURDISH', 'KWANYAMA', 'KYRGYZ', 'LAO',
            'LATIN', 'LATVIAN', 'LETZEBURGESCH', 'LIMBURGISH', 'LINGALA', 'LITHUANIAN', 'LUBA_KATANGA',
            'MACEDONIAN', 'MALAGASY', 'MALAY', 'MALAYALAM', 'MALTESE', 'MANX', 'MAORI', 'MARATHI',
            'MARSHALLESE', 'MONGOLIAN', 'NAURU', 'NAVAJO', 'NDONGA', 'NEPALI', 'NORTH_NDEBELE',
            'NORTHERN_SAMI', 'NORWEGIAN', 'NORWEGIAN_BOKMAL', 'NORWEGIAN_NYNORSK', 'NUOSU_SICHUAN_YI',
            'OCCITAN', 'OJIBWA', 'ORIYA', 'OROMO', 'OSSETIAN', 'PALI', 'PASHTO', 'POLISH', 'PORTUGUESE',
            'PUNJABI', 'QUECHUA', 'ROMANIAN_MOLDOVAN', 'ROMANSH', 'RUNDI', 'RUSSIAN', 'SAMOAN', 'SANGO',
            'SANSKRIT', 'SARDINIAN', 'SERBIAN', 'SHONA', 'SINDHI', 'SINHALA', 'SLOVAK', 'SLOVENIAN',
            'SOMALI', 'SOTHO', 'SOUTH_NDEBELE', 'SPANISH', 'SUNDANESE', 'SWAHILI', 'SWATI', 'SWEDISH',
            'TAGALOG', 'TAHITIAN', 'TAJIK', 'TAMIL', 'TATAR', 'TELUGU', 'THAI', 'TIBETAN', 'TIGRINYA',
            'TONGA', 'TSONGA', 'TSWANA', 'TURKISH', 'TURKMEN', 'TWI', 'UKRAINIAN', 'URDU', 'UYGHUR',
            'UZBEK', 'VALENCIAN_CATALAN', 'VENDA', 'VIETNAMESE', 'VOLAPUK', 'WALLOON', 'WELSH',
            'WESTERN_FRISIAN', 'WOLOF', 'XHOSA', 'YIDDISH', 'YORUBA', 'ZHUANG', 'ZULU'
        ];

        const languages = {};
        for (code of languageCodes) {
            languages[code] = code.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        }
        return languages;
    }

    // Process list of genre options
    function processGenres() {
        const genreCodes = [
            'PODCASTSERIES_ARTS', 'PODCASTSERIES_ARTS_BOOKS', 'PODCASTSERIES_ARTS_DESIGN',
            'PODCASTSERIES_ARTS_FASHION_AND_BEAUTY', 'PODCASTSERIES_ARTS_FOOD',
            'PODCASTSERIES_ARTS_PERFORMING_ARTS', 'PODCASTSERIES_ARTS_VISUAL_ARTS',
            'PODCASTSERIES_BUSINESS', 'PODCASTSERIES_BUSINESS_CAREERS',
            'PODCASTSERIES_BUSINESS_ENTREPRENEURSHIP', 'PODCASTSERIES_BUSINESS_INVESTING',
            'PODCASTSERIES_BUSINESS_MANAGEMENT', 'PODCASTSERIES_BUSINESS_MARKETING',
            'PODCASTSERIES_BUSINESS_NON_PROFIT', 'PODCASTSERIES_COMEDY',
            'PODCASTSERIES_COMEDY_INTERVIEWS', 'PODCASTSERIES_COMEDY_IMPROV',
            'PODCASTSERIES_COMEDY_STANDUP', 'PODCASTSERIES_EDUCATION',
            'PODCASTSERIES_EDUCATION_COURSES', 'PODCASTSERIES_EDUCATION_HOW_TO',
            'PODCASTSERIES_EDUCATION_LANGUAGE_LEARNING', 'PODCASTSERIES_EDUCATION_SELF_IMPROVEMENT',
            'PODCASTSERIES_FICTION', 'PODCASTSERIES_FICTION_COMEDY_FICTION',
            'PODCASTSERIES_FICTION_DRAMA', 'PODCASTSERIES_FICTION_SCIENCE_FICTION',
            'PODCASTSERIES_GOVERNMENT', 'PODCASTSERIES_HISTORY', 'PODCASTSERIES_HEALTH_AND_FITNESS',
            'PODCASTSERIES_HEALTH_AND_FITNESS_ALTERNATIVE_HEALTH', 'PODCASTSERIES_HEALTH_AND_FITNESS_FITNESS',
            'PODCASTSERIES_HEALTH_AND_FITNESS_MEDICINE', 'PODCASTSERIES_HEALTH_AND_FITNESS_MENTAL_HEALTH',
            'PODCASTSERIES_HEALTH_AND_FITNESS_NUTRITION', 'PODCASTSERIES_HEALTH_AND_FITNESS_SEXUALITY',
            'PODCASTSERIES_KIDS_AND_FAMILY', 'PODCASTSERIES_KIDS_AND_FAMILY_EDUCATION_FOR_KIDS',
            'PODCASTSERIES_KIDS_AND_FAMILY_PARENTING', 'PODCASTSERIES_KIDS_AND_FAMILY_PETS_AND_ANIMALS',
            'PODCASTSERIES_KIDS_AND_FAMILY_STORIES_FOR_KIDS', 'PODCASTSERIES_LEISURE',
            'PODCASTSERIES_LEISURE_ANIMATION_AND_MANGA', 'PODCASTSERIES_LEISURE_AUTOMOTIVE',
            'PODCASTSERIES_LEISURE_AVIATION', 'PODCASTSERIES_LEISURE_CRAFTS', 'PODCASTSERIES_LEISURE_GAMES',
            'PODCASTSERIES_LEISURE_HOBBIES', 'PODCASTSERIES_LEISURE_HOME_AND_GARDEN',
            'PODCASTSERIES_LEISURE_VIDEO_GAMES', 'PODCASTSERIES_MUSIC', 'PODCASTSERIES_MUSIC_COMMENTARY',
            'PODCASTSERIES_MUSIC_HISTORY', 'PODCASTSERIES_MUSIC_INTERVIEWS', 'PODCASTSERIES_NEWS',
            'PODCASTSERIES_NEWS_BUSINESS', 'PODCASTSERIES_NEWS_DAILY_NEWS', 'PODCASTSERIES_NEWS_ENTERTAINMENT',
            'PODCASTSERIES_NEWS_COMMENTARY', 'PODCASTSERIES_NEWS_POLITICS', 'PODCASTSERIES_NEWS_SPORTS',
            'PODCASTSERIES_NEWS_TECH', 'PODCASTSERIES_RELIGION_AND_SPIRITUALITY',
            'PODCASTSERIES_RELIGION_AND_SPIRITUALITY_BUDDHISM', 'PODCASTSERIES_RELIGION_AND_SPIRITUALITY_CHRISTIANITY',
            'PODCASTSERIES_RELIGION_AND_SPIRITUALITY_HINDUISM', 'PODCASTSERIES_RELIGION_AND_SPIRITUALITY_ISLAM',
            'PODCASTSERIES_RELIGION_AND_SPIRITUALITY_JUDAISM', 'PODCASTSERIES_RELIGION_AND_SPIRITUALITY_RELIGION',
            'PODCASTSERIES_RELIGION_AND_SPIRITUALITY_SPIRITUALITY', 'PODCASTSERIES_SCIENCE',
            'PODCASTSERIES_SCIENCE_ASTRONOMY', 'PODCASTSERIES_SCIENCE_CHEMISTRY', 'PODCASTSERIES_SCIENCE_EARTH_SCIENCES',
            'PODCASTSERIES_SCIENCE_LIFE_SCIENCES', 'PODCASTSERIES_SCIENCE_MATHEMATICS',
            'PODCASTSERIES_SCIENCE_NATURAL_SCIENCES', 'PODCASTSERIES_SCIENCE_NATURE', 'PODCASTSERIES_SCIENCE_PHYSICS',
            'PODCASTSERIES_SCIENCE_SOCIAL_SCIENCES', 'PODCASTSERIES_SOCIETY_AND_CULTURE',
            'PODCASTSERIES_SOCIETY_AND_CULTURE_DOCUMENTARY', 'PODCASTSERIES_SOCIETY_AND_CULTURE_PERSONAL_JOURNALS',
            'PODCASTSERIES_SOCIETY_AND_CULTURE_PHILOSOPHY', 'PODCASTSERIES_SOCIETY_AND_CULTURE_PLACES_AND_TRAVEL',
            'PODCASTSERIES_SOCIETY_AND_CULTURE_RELATIONSHIPS', 'PODCASTSERIES_SPORTS', 'PODCASTSERIES_SPORTS_BASEBALL',
            'PODCASTSERIES_SPORTS_BASKETBALL', 'PODCASTSERIES_SPORTS_CRICKET', 'PODCASTSERIES_SPORTS_FANTASY_SPORTS',
            'PODCASTSERIES_SPORTS_FOOTBALL', 'PODCASTSERIES_SPORTS_GOLF', 'PODCASTSERIES_SPORTS_HOCKEY',
            'PODCASTSERIES_SPORTS_RUGBY', 'PODCASTSERIES_SPORTS_RUNNING', 'PODCASTSERIES_SPORTS_SOCCER',
            'PODCASTSERIES_SPORTS_SWIMMING', 'PODCASTSERIES_SPORTS_TENNIS', 'PODCASTSERIES_SPORTS_VOLLEYBALL',
            'PODCASTSERIES_SPORTS_WILDERNESS', 'PODCASTSERIES_SPORTS_WRESTLING', 'PODCASTSERIES_TECHNOLOGY',
            'PODCASTSERIES_TRUE_CRIME', 'PODCASTSERIES_TV_AND_FILM', 'PODCASTSERIES_TV_AND_FILM_AFTER_SHOWS',
            'PODCASTSERIES_TV_AND_FILM_HISTORY', 'PODCASTSERIES_TV_AND_FILM_INTERVIEWS',
            'PODCASTSERIES_TV_AND_FILM_FILM_REVIEWS', 'PODCASTSERIES_TV_AND_FILM_TV_REVIEWS'
        ];

        const genres = {};
        let groupLabel = {}; // Temp tracker for current genre group
        for (code of genreCodes) {
            let subcode = code.replace('PODCASTSERIES_', '');

            // Check if genre belongs to current genre group
            if (subcode.startsWith(groupLabel.code)) {
                subcode = subcode.replace(`${groupLabel.code}_`, '');
                genres[code] = `${groupLabel.label}: ${subcode.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ').replaceAll('And', '&').replaceAll('Tv', 'TV')}`;
            } else {
                groupLabel.code = subcode;
                groupLabel.label = subcode.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ').replaceAll('And', '&').replaceAll('Tv', 'TV');
                genres[code] = groupLabel.label;
            }
        }

        return genres;
    }

    // Utility function for rendering episode duration
    function renderDuration(duration) {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;

        // Include hours if number of hours > 0, else exclude
        const durationStringComponents = hours ? [hours, minutes, seconds] : [minutes, seconds];

        // Generate duration string
        const durationString = durationStringComponents.map(component => String(component).padStart(2, '0')).join(':');
        return durationString;
    }

    // Custom class for podcast series
    class PodcastSeries {
        // Registry of podcast series instances
        static registry = new Map();

        // Constructor
        constructor(metadata) {
            // Retrieve podcast series metadata
            this.uuid = metadata.uuid;
            this.title = metadata.name || metadata.title;
            this.description = metadata.description;
            this.imageUrl = metadata.imageUrl;
            this.genres = metadata.genres;
            this.language = metadata.language;

            // Retrieve user interaction state
            if (window.isUserAuthenticated) {
                this.isFollowing = metadata.isFollowing;
                this.isBlocked = metadata.isBlocked;
            }

            // Create empty container for podcast episodes
            this.episodes = [];

            // Create empty placeholder for DOM element node
            this.elementNode = null;

            // Save to registry
            PodcastSeries.registry.set(this.uuid, this);
        }

        // Render DOM element
        render() {
            // Clone template node
            const template = document.querySelector('#podcast-item-template');
            if (!template) return;
            const templateClone = template.content.cloneNode(true);

            // Remove episode-specific components
            templateClone.querySelectorAll('.podcast-item-duration, .podcast-add-btn, .podcast-play-btn, .podcast-finish-btn, .podcast-bookmark-btn').forEach(component => {
                component.remove();
            });

            // Populate metadata
            templateClone.querySelector('.podcast-item-image img').src = this.imageUrl;
            templateClone.querySelector('.podcast-item-title').textContent = this.title;
            templateClone.querySelector('.podcast-item-subtitle').textContent = this.description;

            // Set user interaction state
            if (this.isFollowing) templateClone.querySelector('.podcast-follow-btn')?.classList.add('active');
            if (this.isBlocked) templateClone.querySelector('.podcast-block-btn')?.classList.add('active');

            // Event listeners
            templateClone.querySelector('.podcast-info-btn').addEventListener('click', () => {
                this.showDetails();
            });
            templateClone.querySelector('.podcast-follow-btn')?.addEventListener('click', event => {
                this.toggleFollow(event, this);
            });
            templateClone.querySelector('.podcast-block-btn')?.addEventListener('click', event => {
                this.toggleBlock(event, this);
            });

            this.elementNode = templateClone.firstElementChild;
            templateClone.firstElementChild.__podcastSeries = this;
            return templateClone;
        }

        // Move DOM element to container
        move(targetContainer) {
            if (!this.elementNode) {
                this.render();
            }
            targetContainer.appendChild(this.elementNode);
        }

        // Update user interaction state
        updateStatus() {
            if (!this.elementNode || !window.isUserAuthenticated) return;

            // Clear current status
            this.elementNode.querySelectorAll('.podcast-item-badges button').forEach(button => {
                button.classList.remove('active');
            });

            // Update status
            if (this.isFollowing) this.elementNode.querySelector('.podcast-follow-btn')?.classList.add('active');
            if (this.isBlocked) this.elementNode.querySelector('.podcast-block-btn')?.classList.add('active');
        }

        // Render detailed info dialog
        showDetails() {
            // Clone template node
            const template = document.querySelector('#podcast-dialog-template');
            if (!template) return;
            const templateClone = template.content.cloneNode(true);

            // Populate series metadata
            templateClone.querySelector('.dialog-main-image img').src = this.imageUrl;
            templateClone.querySelector('.dialog-main-duration').remove();
            templateClone.querySelector('.dialog-main-type').textContent = 'Series';
            templateClone.querySelector('.dialog-main-title').textContent = this.title;
            templateClone.querySelector('.dialog-main-description').innerHTML = this.description;
            templateClone.querySelector('.dialog-main-tags').innerHTML = '';
            for (let genre of this.genres) {
                templateClone.querySelector('.dialog-related-tags').innerHTML += `<li>${genres[genre]}</li>`;
            }
            templateClone.querySelector('.dialog-related').remove();

            // Style links
            templateClone.querySelectorAll('.dialog-main-description a').forEach(link => {
                link.classList.add('link');
            });

            // Set user interaction state
            templateClone.querySelector('.podcast-finish-btn')?.remove();
            templateClone.querySelector('.podcast-bookmark-btn')?.remove();
            if (this.isFollowing) templateClone.querySelector('.podcast-follow-btn')?.classList.add('active');
            if (this.isBlocked) templateClone.querySelector('.podcast-block-btn')?.classList.add('active');

            // Event listeners
            templateClone.querySelector('.podcast-follow-btn')?.addEventListener('click', event => {
                this.toggleFollow(event, this);
            });
            templateClone.querySelector('.podcast-block-btn')?.addEventListener('click', event => {
                this.toggleBlock(event, this);
            });

            // Show dialog
            const dialog = document.querySelector('.podcast-info-dialog');
            const dialogContentContainer = dialog.querySelector('.dialog-content-wrapper');
            dialogContentContainer.innerHTML = ''; // Clear any existing content
            dialogContentContainer.appendChild(templateClone);
            dialog.showModal();
        }

        // Follow series
        async toggleFollow(event, targetInstance) {
            // Check if user is logged in
            if (!window.isUserAuthenticated) return;

            const button = event.currentTarget;
            button.disabled = true; // Temporarily disable button

            // Create empty FormData object
            const form = new FormData();
            form.set('uuid', this.uuid);
            form.set('follow', !this.isFollowing);
            form.set('csrfmiddlewaretoken', document.querySelector('input[name="csrfmiddlewaretoken"]').value);

            // Submit form
            const response = await fetch('/action/series/follow', {
                method: 'POST',
                body: form
            });
            button.disabled = false; // Re-enable button
            if (!response.ok) return;

            // Update following status
            const result = await response.json();
            this.isFollowing = result.newStatus;

            // Re-render dialog if it's currently open
            const dialog = document.querySelector('.podcast-info-dialog');
            if (dialog.open) {
                dialog.close();
                targetInstance.showDetails();
            }

            // Update DOM element (if any)
            this.updateStatus();

            // Update all podcast episodes elements (if any)
            this.episodes.forEach(episode => {
                episode.updateStatus();
            });
        }

        // Block series
        async toggleBlock(event, targetInstance) {
            // Check if user is logged in
            if (!window.isUserAuthenticated) return;

            const button = event.currentTarget;
            button.disabled = true; // Temporarily disable button

            // Create empty FormData object
            const form = new FormData();
            form.set('uuid', this.uuid);
            form.set('block', !this.isBlocked);
            form.set('csrfmiddlewaretoken', document.querySelector('input[name="csrfmiddlewaretoken"]').value);

            // Submit form
            const response = await fetch('/action/series/block', {
                method: 'POST',
                body: form
            });
            button.disabled = false; // Re-enable button
            if (!response.ok) return;

            // Update blocked status
            const result = await response.json();
            this.isBlocked = result.newStatus;

            // Re-render dialog if it's currently open
            const dialog = document.querySelector('.podcast-info-dialog');
            if (dialog.open) {
                dialog.close();
                targetInstance.showDetails();
            }

            // Update DOM element (if any)
            this.updateStatus();

            // Update all podcast episodes elements (if any)
            this.episodes.forEach(episode => {
                episode.updateStatus();
            });
        }
    }

    // Custom class for podcast episodes
    class PodcastEpisode {
        // Constructor
        constructor(metadata) {
            // Retrieve podcast episode metadata
            this.uuid = metadata.uuid;
            this.title = metadata.name || metadata.title;
            this.description = metadata.description;
            this.duration = metadata.duration;
            this.imageUrl = metadata.imageUrl == null ? metadata.podcastSeries.imageUrl : metadata.imageUrl;
            this.audioUrl = metadata.audioUrl;

            // Retrieve user interaction state
            if (window.isUserAuthenticated) {
                this.isFinished = metadata.isFinished;
                this.isBookmarked = metadata.isBookmarked;
            }

            // Create empty placeholder for DOM element node
            this.elementNode = null;

            // Check if series already exists in registry, otherwise create one
            if (PodcastSeries.registry.get(metadata.podcastSeries.uuid)) {
                const series = PodcastSeries.registry.get(metadata.podcastSeries.uuid);
                series.episodes.push(this);
                this.series = series;
            } else {
                this.series = new PodcastSeries(metadata.podcastSeries);
                this.series.episodes.push(this);
            }
        }

        // Render DOM element
        render() {
            // Clone template node
            const template = document.querySelector('#podcast-item-template');
            if (!template) return;
            const templateClone = template.content.cloneNode(true);

            // Populate metadata
            templateClone.querySelector('.podcast-item-image img').src = this.imageUrl;
            templateClone.querySelector('.podcast-item-duration').textContent = renderDuration(this.duration);
            templateClone.querySelector('.podcast-item-title').textContent = this.title;
            templateClone.querySelector('.podcast-item-subtitle').textContent = this.series.title;
            if (templateClone.querySelector('input[name="uuid"]')) {
                templateClone.querySelector('input[name="uuid"]').value = this.uuid;
            }
            if (templateClone.querySelector('.podcast-go-btn')) {
                templateClone.querySelector('.podcast-go-btn').href = `/player/episode/${this.uuid}`;
            }

            // Set user interaction state
            if (this.isFinished) templateClone.querySelector('.podcast-finish-btn')?.classList.add('active');
            if (this.isBookmarked) templateClone.querySelector('.podcast-bookmark-btn')?.classList.add('active');
            if (this.series.isFollowing) templateClone.querySelector('.podcast-follow-btn')?.classList.add('active');
            if (this.series.isBlocked) templateClone.querySelector('.podcast-block-btn')?.classList.add('active');

            // Event listeners
            templateClone.querySelector('.podcast-info-btn').addEventListener('click', () => {
                this.showDetails();
            });
            templateClone.querySelector('.podcast-finish-btn')?.addEventListener('click', event => {
                this.toggleFinish(event);
            });
            templateClone.querySelector('.podcast-bookmark-btn')?.addEventListener('click', event => {
                this.toggleBookmark(event);
            });
            templateClone.querySelector('.podcast-follow-btn')?.addEventListener('click', event => {
                this.series.toggleFollow(event, this);
            });
            templateClone.querySelector('.podcast-block-btn')?.addEventListener('click', event => {
                this.series.toggleBlock(event, this);
            });

            this.elementNode = templateClone.firstElementChild;
            templateClone.firstElementChild.__podcastEpisode = this;
            return templateClone;
        }

        // Move DOM element to container
        move(targetContainer) {
            if (!this.elementNode) {
                this.render();
            }
            targetContainer.appendChild(this.elementNode);
            return this.duration;
        }

        // Update user interaction state
        updateStatus() {
            if (!this.elementNode || !window.isUserAuthenticated) return;

            // Clear current status
            this.elementNode.querySelectorAll('.podcast-item-badges button').forEach(button => {
                button.classList.remove('active');
            });

            // Update status
            if (this.isFinished) this.elementNode.querySelector('.podcast-finish-btn')?.classList.add('active');
            if (this.isBookmarked) this.elementNode.querySelector('.podcast-bookmark-btn')?.classList.add('active');
            if (this.series.isFollowing) this.elementNode.querySelector('.podcast-follow-btn')?.classList.add('active');
            if (this.series.isBlocked) this.elementNode.querySelector('.podcast-block-btn')?.classList.add('active');
        }

        // Render detailed info dialog
        showDetails() {
            // Clone template node
            const template = document.querySelector('#podcast-dialog-template');
            if (!template) return;
            const templateClone = template.content.cloneNode(true);

            // Populate episode metadata
            templateClone.querySelector('.dialog-main-image img').src = this.imageUrl;
            templateClone.querySelector('.dialog-main-duration').textContent = renderDuration(this.duration);
            templateClone.querySelector('.dialog-main-type').textContent = 'Episode';
            templateClone.querySelector('.dialog-main-title').textContent = this.title;
            templateClone.querySelector('.dialog-main-description').innerHTML = this.description;
            templateClone.querySelector('.dialog-main-tags').remove();

            // Populate series metadata
            templateClone.querySelector('.dialog-related-type').textContent = 'Series';
            templateClone.querySelector('.dialog-related-title').textContent = this.series.title;
            templateClone.querySelector('.dialog-related-description').innerHTML = this.series.description;
            templateClone.querySelector('.dialog-related-tags').innerHTML = '';
            for (let genre of this.series.genres) {
                templateClone.querySelector('.dialog-related-tags').innerHTML += `<li>${genres[genre]}</li>`;
            }

            // Style links
            templateClone.querySelectorAll('.dialog-main-description a, .dialog-related-description a').forEach(link => {
                link.classList.add('link');
            });

            // Set user interaction state
            if (this.isFinished) templateClone.querySelector('.podcast-finish-btn')?.classList.add('active');
            if (this.isBookmarked) templateClone.querySelector('.podcast-bookmark-btn')?.classList.add('active');
            if (this.series.isFollowing) templateClone.querySelector('.podcast-follow-btn')?.classList.add('active');
            if (this.series.isBlocked) templateClone.querySelector('.podcast-block-btn')?.classList.add('active');

            // Event listeners
            templateClone.querySelector('.podcast-finish-btn')?.addEventListener('click', event => {
                this.toggleFinish(event);
            });
            templateClone.querySelector('.podcast-bookmark-btn')?.addEventListener('click', event => {
                this.toggleBookmark(event);
            });
            templateClone.querySelector('.podcast-follow-btn')?.addEventListener('click', event => {
                this.series.toggleFollow(event, this);
            });
            templateClone.querySelector('.podcast-block-btn')?.addEventListener('click', event => {
                this.series.toggleBlock(event, this);
            });

            // Show dialog
            const dialog = document.querySelector('.podcast-info-dialog');
            const dialogContentContainer = dialog.querySelector('.dialog-content-wrapper');
            dialogContentContainer.innerHTML = ''; // Clear any existing content
            dialogContentContainer.appendChild(templateClone);
            dialog.showModal();
        }

        // Mark episode as finished
        async toggleFinish(event) {
            // Check if user is logged in
            if (!window.isUserAuthenticated) return;

            const button = event.currentTarget;
            button.disabled = true; // Temporarily disable button

            // Create empty FormData object
            const form = new FormData();
            form.set('uuid', this.uuid);
            form.set('finish', !this.isFinished);
            form.set('csrfmiddlewaretoken', document.querySelector('input[name="csrfmiddlewaretoken"]').value);

            // Submit form
            const response = await fetch('/action/episode/finish', {
                method: 'POST',
                body: form
            });
            button.disabled = false; // Re-enable button
            if (!response.ok) return;

            // Update finished status
            const result = await response.json();
            this.isFinished = result.newStatus;

            // Re-render dialog if it's currently open
            const dialog = document.querySelector('.podcast-info-dialog');
            if (dialog.open) {
                dialog.close();
                this.showDetails();
            }

            // Update DOM element
            this.updateStatus();
        }

        // Bookmark episode
        async toggleBookmark(event) {
            // Check if user is logged in
            if (!window.isUserAuthenticated) return;

            const button = event.currentTarget;
            button.disabled = true; // Temporarily disable button

            // Create empty FormData object
            const form = new FormData();
            form.set('uuid', this.uuid);
            form.set('bookmark', !this.isBookmarked);
            form.set('csrfmiddlewaretoken', document.querySelector('input[name="csrfmiddlewaretoken"]').value);

            // Submit form
            const response = await fetch('/action/episode/bookmark', {
                method: 'POST',
                body: form
            });
            button.disabled = false; // Re-enable button
            if (!response.ok) return;

            // Update bookmarked status
            const result = await response.json();
            this.isBookmarked = result.newStatus;

            // Re-render dialog if it's currently open
            const dialog = document.querySelector('.podcast-info-dialog');
            if (dialog.open) {
                dialog.close();
                this.showDetails();
            }

            // Update DOM element
            this.updateStatus();
        }
    }

    // Custom class for playlists
    class Playlist {
        // Constructor
        constructor(playlistData) {
            this.id = playlistData.id;
            this.created = playlistData.created;
            this.episodes = playlistData.episodes;
            this.duration = playlistData.episodes.reduce((duration, episode) => duration + episode.duration, 0);

            // Create empty placeholder for DOM element node
            this.elementNode = null;
        }

        // Render DOM element
        render() {
            // Clone template node
            const template = document.querySelector('#podcast-playlist-template');
            if (!template) return;
            const templateClone = template.content.cloneNode(true);

            // Populate metadata
            const dateFormatter = new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            templateClone.querySelector('.playlist-item-date').textContent = dateFormatter.format(new Date(this.created));
            templateClone.querySelector('.playlist-item-duration').textContent = renderDuration(this.duration);

            // Populate episodes
            const podcastItemContainer = templateClone.querySelector('.podcast-item-list');
            for (let episode of this.episodes) {
                new PodcastEpisode(episode).move(podcastItemContainer);
            }

            // Set link href
            templateClone.querySelector('.playlist-go-btn').href = `/player/playlist/${this.id}`;

            this.elementNode = templateClone.firstElementChild;
            templateClone.firstElementChild.__playlist = this;
            return templateClone;
        }

        // Move DOM element to container
        move(targetContainer) {
            if (!this.elementNode) {
                this.render();
            }
            targetContainer.appendChild(this.elementNode);
        }
    }

    // Event listener for dialog close button
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.dialog-close-btn').forEach(button => {
            button.addEventListener('click', () => {
                button.closest('dialog').close();
            });
        });
    });

    window.languages = processLanguages();
    window.genres = processGenres();
    window.renderDuration = renderDuration;
    window.PodcastSeries = PodcastSeries;
    window.PodcastEpisode = PodcastEpisode;
    window.Playlist = Playlist;
})();
