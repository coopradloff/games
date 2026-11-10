document.addEventListener("DOMContentLoaded", async () => {
    const gridContainer = document.getElementById('game-grid');
    const searchInput = document.getElementById('search-input');
    const gameCounter = document.getElementById('game-counter');
    const noResults = document.getElementById('no-results');

    let allGames = [];

    try {
        const response = await fetch('games.json');
        if (!response.ok) throw new Error("Could not load games.json");
        allGames = await response.json();
        
        renderGames(allGames);
        updateCounter(allGames.length, allGames.length);
    } catch (error) {
        console.error("Error loading games:", error);
        gridContainer.innerHTML = `<p style="color: #ef4444; grid-column: 1/-1; text-align: center;">Failed to load games.json. Check console for details.</p>`;
        gameCounter.textContent = "Error";
    }
    // test v2
    // Render cards function
    function renderGames(gamesToRender) {
        gridContainer.innerHTML = '';
        
        if (gamesToRender.length === 0) {
            noResults.classList.remove('hidden');
            return;
        } else {
            noResults.classList.add('hidden');
        }

        gamesToRender.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            
            card.innerHTML = `
                <img src="${game.icon}" alt="${game.name}" class="game-icon" onerror="this.src='https://api.iconify.design/lucide:gamepad-2.svg?color=%2394a3b8'">
                <span class="game-name" title="${game.name}">${game.name}</span>
            `;

            card.addEventListener('click', () => {
                window.location.href = game.path;
            });

            gridContainer.appendChild(card);
        });
    }

    function updateCounter(current, total) {
        gameCounter.textContent = current === total ? `${total} Games` : `${current} of ${total} Games`;
    }

    // Live search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = allGames.filter(game => game.name.toLowerCase().includes(query));
        renderGames(filtered);
        updateCounter(filtered.length, allGames.length);
    });

    // Keyboard shortcut '/' to focus search
    window.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    });
});