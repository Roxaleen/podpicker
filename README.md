# PodPicker
Have you ever wished you had something to listen to during a 45-minute commute? Or a 1-hour wait at the laundromat? Or the 30 minutes while you're cleaning, exercising, or doing anything else?

If you answered "yes" to any of the above, then PodPicker is an app for you!

Check out the live demo: [PodPicker](https://podpicker.tinkerer.live)

## Key Features

PodPicker is a web app with a simple purpose: It handpicks a podcast playlist that matches a specified time duration.

* **Playlist configuration:** Only a target duration is required to create a playlist. Optionally, users can input specific search terms or filter episodes by publication date, language, or genre.

    The created playlist can then be played directly within the app.

* **Personalization:** The playlist builder and player can be accessed with or without an account.

    Logged-in users benefit from greater customization and history features. This includes the ability to review previously created playlists, bookmark favorite podcast episodes, and block or follow specific podcast series.

## Playlist Builder Algorithm

At the core of PodPicker is the algorithm for building a playlist from available podcast episodes.

### Requirements

The optimal playlist should meet following expectations:

* **Relevance:** Episodes most relevant to the search query should be prioritized.
* **Recency:** More recently published episodes should be prioritized.
* **Diversity:** The playlist should include episodes across different podcast series. Multiple episodes from the same series should only be included if better alternatives are unavailable.
* **Duration:** The overall playlist duration should be as close as possible to the target duration, without exceeding it.

### Implementation

#### Episode Ratings

The podcast service provider ([Taddy.org](https://taddy.org/developers/podcast-api)) provides a relevance rating for every search result, as an integer between 0 and 100.

To account for recency, these ratings are adjusted by subtracting the number of months since publication (capped at 20).

> *Example:* An episode that has a relevance rating of 100 and was published 10 months ago will have an adjusted rating of `100 - 10 = 90`.

#### Playlist Scores

A scoring function is then used to quantify how well a playlist meets the above requirements:

```
Score = Average episode rating
        × (Unique series count / Episode count)
        × (Playlist duration / Target duration)²
```

This function is the product of three terms:

* **Rating term:** The first term accounts for the relevance and recency of playlist episodes. By using the *average* rather than the *sum* of individual ratings, it prioritizes quality (fewer episodes with higher ratings) over quantity (more numerous episodes, but lower individual ratings).
* **Diversity term:** The second term penalizes combinations with multiple episodes from the same series.
* **Duration term:** The third term measures how close the overall playlist duration is to the target duration. This term is *squared* so that playlists far below the target duration are penalized much more severely than those closer to it.

#### Algorithm

A recursive **branch-and-bound (B&B)** algorithm is used to determine the playlist with the highest score.

Below is an overview of the steps:

1. Pre-sort the list of available episodes by their adjusted ratings.

2. Maintain a *global best* of the highest score found so far.

3. Visualize possible playlist combinations as a binary tree. At each node, consider two possibilities: include the next episode (left branch) or exclude it (right branch).
  
    * If a leaf node is reached, compute the score of the playlist combination. If this score exceeds the current global best, update the global best.
    * If a combination exceeds the target duration, prune the subtree.
    * Otherwise, compute an *optimistic upper bound* for the highest score that can be achieved in the current subtree. If this upper bound falls below the global best, prune the subtree.

4. Return the playlist with the global best score.

### Discussion

Theoretically, the number of possible combinations for `n` candidate episodes is `2ⁿ`. By design, each search returns a maximum of 25 episodes, which creates a total of ~33 million combinations.

However, with tightly calculated upper bounds, the vast majority of these combinations are pruned and never taken into consideration. Pre-sorting the list ensures that the strongest options are considered first, maximizing pruning.

Besides B&B, other algorithms have been considered and deemed unsuitable for this use case:

* **Dynamic programming (DP)**: Combining items to maximize a value (*playlist score*) within a capacity constraint (*duration*) is a classic representation of a knapsack problem. However, a knapsack-style DP algorithm is impractical for this use case because the scoring function is not linear.

* **Greedy**: While simple to implement, a greedy algorithm cannot guarantee that the optimal combination will be found. It's also unable to account for all the non-linear score components.

## Version History

PodPicker was initially created as the final project for the [Web Programming with Python and JavaScript (CS50W)](https://cs50.harvard.edu/web/) course by HarvardX.

* **[v1 (current)](https://github.com/Roxaleen/podpicker/releases/tag/v1):** The current version features multiple enhancements to the UI and the search functionality.

    In the playlist builder, the primitive greedy algorithm is replaced by the more optimized B&B algorithm.

* **[v0](https://github.com/Roxaleen/podpicker/releases/tag/v0):** This is the version initially submitted as the final project for CS50W. It incorporated the core app features, such as search, playback, and personalized history filters.

    A simple greedy algorithm was used for the playlist builder. It only considered the playlist duration, without accounting for relevance, recency, or diversity.

## Acknowledgements

PodPicker relies on the podcast database and podcast search engine provided by [Taddy.org](https://taddy.org/developers/podcast-api).
