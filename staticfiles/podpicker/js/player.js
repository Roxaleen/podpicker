(function() {
    const player = document.querySelector('.player');

    function loadPlayer(podcastItem) {
        // Clear current playing status
        document.querySelectorAll('.podcast-item').forEach(item => {
            item.classList.remove('playing');
        });
        document.querySelectorAll('.podcast-play-btn').forEach(item => {
            item.classList.remove('podcast-pause-btn');
        });

        // Mark target item as playing
        podcastItem.classList.add('playing');

        // Set player src
        player.src = podcastItem.__podcastEpisode.audioUrl;
    }

    function handlePlay() {
        // Get current playback item
        const item = document.querySelector('.playing');
        const itemControlBtn = item.querySelector('.podcast-play-btn');

        // Set button functionality
        itemControlBtn.classList.add('podcast-pause-btn');
        itemControlBtn.title = "Pause";
    }

    function handlePause() {
        // Get current playback item
        const item = document.querySelector('.playing');
        const itemControlBtn = item.querySelector('.podcast-play-btn');

        // Set button functionality
        itemControlBtn.classList.remove('podcast-pause-btn');
        itemControlBtn.title = "Play";
    }

    function handleEndPlayback(event) {
        // Get current playback item
        const item = document.querySelector('.playing');

        // Mark item as finished
        item.__podcastEpisode?.toggleFinish(event);

        // Load next item (if applicable)
        const nextItem = document.querySelector('.playing + .podcast-item');
        if (nextItem) {
            loadPlayer(nextItem);
            player.play();
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Retrieve injected data
        const appDataScript = document.querySelector('#app-data');
        const appData = JSON.parse(appDataScript.textContent);
        appDataScript.remove();

        // Check if user is authenticated
        window.isUserAuthenticated = appData.username ? true : false;

        // Populate playlist items
        const playerItemContainer = document.querySelector('.podcast-item-list');
        for (episode of appData.player_data) {
            new PodcastEpisode(episode).move(playerItemContainer);
        }

        // Prepare to play first item
        loadPlayer(document.querySelector('.podcast-item'));

        // Event listener for play buttons
        document.querySelectorAll('.podcast-play-btn').forEach(button => {
            button.addEventListener('click', event => {
                const targetItem = event.currentTarget.closest('.podcast-item');

                if (!targetItem.classList.contains('playing')) {
                    // If item isn't currently playing, play item
                    loadPlayer(targetItem);
                    player.play();
                } else {
                    // If item is currently playing, toggle play/pause
                    if (player.paused) {
                        player.play();
                    } else {
                        player.pause();
                    }
                }
            });
        });

        // Event listener for playback events
        player.addEventListener('play', handlePlay);
        player.addEventListener('pause', handlePause);
        player.addEventListener('ended', handleEndPlayback);
    });
})();
