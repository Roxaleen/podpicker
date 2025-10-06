(function() {
    function populateLanguages() {
        // Populate list of language options
        const languageListContainer = document.querySelector('.picker-language-list');
        for ([code, label] of Object.entries(languages)) {
            languageListContainer.innerHTML += `<li><label><input type="checkbox" name="language" value="${code}">${label}</label></li>`;
        }
    }

    function populateGenres() {
        // Populate list of genre options
        let html = '';

        for ([code, label] of Object.entries(genres)) {
            if (!label.includes(':')) {
                html += `</ul></li><li><strong>${label}</strong><ul class="tag-cloud">`;
                html += `<li><label><input type="checkbox" name="genre" value="${code}">${label}</label></li>`;
            } else {
                html += `<li data-genre-group="${label.split(': ')[0]}"><label><input type="checkbox" name="genre" value="${code}">${label.split(': ')[1]}</label></li>`;
            }
        }
        html = html.replace('</ul></li>', '');

        const genreListContainer = document.querySelector('.picker-genre-list');
        genreListContainer.innerHTML = html;
    }

    function updateDuration(event) {
        // Update the playlist duration according to slider input
        const inputSlider = event.currentTarget;
        const inputValue = parseInt(inputSlider.value);
        const inputMax = inputSlider.max;
        const outputField = document.querySelector('.picker-hero-duration');

        outputField.textContent = `${inputValue} minutes`;
        outputField.style.setProperty('--pointer-left', `calc((100% - 0.5em - 1.5rem) * ${inputValue / inputMax} + 0.25em)`);
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Initialize duration slider
        document.querySelector('.picker-hero-input').addEventListener('input', updateDuration);

        // Populate language and genre options
        populateLanguages();
        populateGenres();

        // Pre-select English language
        const englishInput = document.querySelector('input[value="ENGLISH"]');
        englishInput.checked = true;
        document.querySelector('.picker-language-selected').appendChild(englishInput.closest('li'));

        // Event listener for language selection
        const languageSelectionContainer = document.querySelector('.picker-language-selected');
        const languageListContainer = document.querySelector('.picker-language-list');

        languageListContainer.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => {
                const tag = event.currentTarget.closest('li');
                languageSelectionContainer.appendChild(tag);
            }, { once: true });
        });

        // Event listener for genre selection
        const genreSelectionContainer = document.querySelector('.picker-genre-selected');
        const genreListContainer = document.querySelector('.picker-genre-list');

        genreListContainer.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => {
                const tag = event.currentTarget.closest('li');

                // Append genre group as prefix (if applicable)
                const group = tag.getAttribute('data-genre-group');
                if (group) {
                    const prefix = document.createTextNode(`${group}: `);
                    tag.lastChild.insertBefore(prefix, tag.lastChild.lastChild);
                }

                genreSelectionContainer.appendChild(tag);
            }, { once: true });
        });

        // Event listener for expandable option lists
        document.querySelectorAll('.picker-settings .expandable-btn').forEach(button => {
            button.addEventListener('click', () => {
                if (button.getAttribute('aria-expanded') == 'true') {
                    button.setAttribute('aria-expanded', 'false');
                    button.setAttribute('aria-label', 'Show all options');
                } else {
                    button.setAttribute('aria-expanded', 'true');
                    button.setAttribute('aria-label', 'Hide all options');
                }
            });
        });
    });
})();
