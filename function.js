document.addEventListener('DOMContentLoaded', () => {
    const descriptions = document.querySelectorAll('.description');
    const proficiencyInputs = document.querySelectorAll('input[type="range"]');
    const totalProficiencySpan = document.getElementById('total-proficiency');
    const proficiencyValues = document.querySelectorAll('.proficiency-value');
    const gradientOverlay = document.getElementById('gradientOverlay');
    const totalNumber = document.getElementById('totalNumber');

    
    //***** HIDE AND SHOW DESCRIPTIONS *****//
    descriptions.forEach(description => {
        const fullText = description.getAttribute('data-full-text');
        
        // Check if fullText is null or empty
        if (!fullText) {
            console.error("Full text not found for description:", description);
            return; // Skip processing this description if data-full-text is missing
        }

        const truncatedText = fullText.slice(0, 150);
        
        // Set initial truncated text
        description.innerHTML = `${truncatedText}<span class="ellipsis">...</span> <a href="#" class="show-more">more</a>`;

        // Event listener for 'show more'
        description.addEventListener('click', (event) => {
            event.preventDefault();
            const target = event.target;

            if (target.classList.contains('show-more')) {
                // Show full text with 'less' link
                description.innerHTML = `${fullText} <a href="#" class="show-less">less</a>`;
            } else if (target.classList.contains('show-less')) {
                // Return to truncated text with 'show more' link
                description.innerHTML = `${truncatedText}<span class="ellipsis">...</span> <a href="#" class="show-more">more</a>`;
            }
        });
    });
    

    //***** SCORE POSITIONING *****//

    if (!gradientOverlay) {
        console.error("The element with ID 'gradientOverlay' could not be found.");
        return; // Prevent further execution if the element is not found
    }

    // Load saved values from localStorage
    proficiencyInputs.forEach((input, index) => {
        const savedValue = localStorage.getItem(input.id);
        if (savedValue !== null) {
            input.value = savedValue;
            proficiencyValues[index].textContent = savedValue;
        } else {
            proficiencyValues[index].textContent = input.value;
        }
    });

    // * Function to update total proficiency and visualization * //
    function updateTotalProficiency() {
        let total = 0;
        proficiencyInputs.forEach((input, index) => {
            total += parseInt(input.value);
            proficiencyValues[index].textContent = input.value;
        });
        totalProficiencySpan.textContent = total;
        updateVisualization(total);
    }

    // * Recalculate and reposition the score overlay * //
    function updateVisualization(totalProficiency) {
        const minProficiency = 1;
        const maxProficiency = 35;
        const range = maxProficiency - minProficiency;
        let percentage = ((totalProficiency - minProficiency) / range) * 100;
        percentage = Math.min(100, Math.max(0, percentage));

        gradientOverlay.style.top = `${100 - percentage}%`;
        gradientOverlay.style.height = '20%';
        totalNumber.innerHTML = `${totalProficiency}`;
    }

    // Event listener to update proficiency and store value in localStorage
    proficiencyInputs.forEach(input => {
        input.addEventListener('input', () => {
            localStorage.setItem(input.id, input.value);
            updateTotalProficiency();
        });
    });

    // Initial update to set total proficiency and visualization based on loaded values
    updateTotalProficiency();
});


