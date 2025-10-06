(function() {
    // Set loading trackers
    let isLoading = false;
    let loadPage = 1;

    async function handleScroll(event) {
        // Check if scroll position is near the bottom
        const scrollBuffer = 200;
        if ((window.innerHeight + window.scrollY) < (document.body.offsetHeight - scrollBuffer)) return;

        // Check if data retrieval is already in progress
        if (isLoading) return;

        // Get data
        isLoading = true;
        try {
            await getData();
        } finally {
            isLoading = false;
        }
    }

    // Get more data for current list type
    async function getData() {
        // Fetch data
        const response = await fetch(`/profile/data/${window.listType}?page=${loadPage}`);
        if (!response.ok) return;
        const data = await response.json();

        // If there are no more items, remove event listener
        if (!data.has_next) {
            document.removeEventListener('scroll', handleScroll);
        }

        // Render items
        const profileItemContainer = document.querySelector('.profile-content-items');
        for (item of data.items) {
            if (window.listType == 'playlists') {
                new Playlist(item).move(profileItemContainer);
            } else if (['finished', 'bookmarked'].includes(window.listType)) {
                new PodcastEpisode(item).move(profileItemContainer);
            } else if (['following', 'blocked'].includes(window.listType)) {
                new PodcastSeries(item).move(profileItemContainer);
            }
        }

        // If all successful, increment page number
        loadPage++;
    }

    document.addEventListener('scroll', handleScroll);
    document.addEventListener('DOMContentLoaded', () => {
        // Retrieve injected data
        const appDataScript = document.querySelector('#app-data');
        const appData = JSON.parse(appDataScript.textContent);
        appDataScript.remove();

        // Check if user is authenticated
        window.isUserAuthenticated = appData.username ? true : false;

        // Check current list view type
        window.listType = appData.list_type;
        if (!['playlists', 'finished', 'bookmarked', 'following', 'blocked'].includes(window.listType)) return;

        // Get data
        getData();
    });
})();
