(function() {
    document.addEventListener('DOMContentLoaded', () => {
        // Retrieve injected data
        const appDataScript = document.querySelector('#app-data');
        const appData = JSON.parse(appDataScript.textContent);
        appDataScript.remove();

        // Check if user is authenticated
        window.isUserAuthenticated = appData.username ? true : false;

        // Populate playlist items
        const playlistContainer = document.querySelector('.picker-hero-items');
        const playlistDurationText = document.querySelector('.picker-hero-duration-value');
        let playlistDuration = 0;

        for (episode of appData.playlist_data) {
            // Insert podcast item
            new PodcastEpisode(episode).move(playlistContainer);

            // Update playlist duration
            playlistDuration += episode.duration
            playlistDurationText.textContent = renderDuration(playlistDuration);
        }

        // Populate extra items
        const playlistOptionsContainer = document.querySelector('.picker-options-items');
        for (episode of appData.extra_data) {
            new PodcastEpisode(episode).move(playlistOptionsContainer);
        }

        // Event listeners for adding & removing items
        document.querySelectorAll('.podcast-add-btn').forEach(button => {
            button.addEventListener('click', () => {
                const playlistItem = button.closest('.podcast-item');
                playlistDuration += playlistItem.__podcastEpisode.move(playlistContainer);
                playlistDurationText.textContent = renderDuration(playlistDuration);
            });
        });
        document.querySelectorAll('.podcast-remove-btn').forEach(button => {
            button.addEventListener('click', () => {
                const playlistItem = button.closest('.podcast-item');
                playlistDuration -= playlistItem.__podcastEpisode.move(playlistOptionsContainer);
                playlistDurationText.textContent = renderDuration(playlistDuration);
            });
        });
    });
})();
