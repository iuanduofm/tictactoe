const gameBoard = document.getElementById('game-board');
const cells = document.querySelectorAll('.cell');
const gameStatus = document.getElementById('game-status');
const resetButton = document.getElementById('reset-button');

let currentPlayer = 'P'; // P for Peas, C for Carrots
let boardState = Array(9).fill(null);
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Add or update the game status container
const feedbackContainer = document.createElement('div');
feedbackContainer.id = 'move-feedback';
feedbackContainer.style.marginTop = '10px';
feedbackContainer.style.padding = '10px';
feedbackContainer.style.borderRadius = '5px';
feedbackContainer.style.textAlign = 'center';
feedbackContainer.style.fontWeight = 'bold';
resetButton.after(feedbackContainer);

function handleCellClick(event) {
    const clickedCell = event.target.closest('.cell');
    if (!clickedCell) return;
    
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (boardState[clickedCellIndex] !== null || !gameActive) {
        return;
    }

    // Store the current player for evaluation after the move
    const playerWhoMoved = currentPlayer;
    
    // Get the optimal move before making the actual move
    const optimalMove = getOptimalMove(boardState, playerWhoMoved);
    
    // Make the move
    boardState[clickedCellIndex] = playerWhoMoved;
    if (playerWhoMoved === 'P') {
        clickedCell.innerHTML = `<svg class="pea-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
            <!-- Pea Pod Background Glow -->
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <!-- Pea Pod Shell -->
            <path d="M25,35 C15,45 15,65 25,75 C35,85 75,85 85,75 C95,65 95,45 85,35 C75,25 35,25 25,35 Z" fill="#1B5E20" />
            <path d="M28,38 C19,47 19,63 28,72 C37,81 73,81 82,72 C91,63 91,47 82,38 C73,29 37,29 28,38 Z" fill="#2E7D32" />
            <path d="M30,40 C22,48 22,62 30,70 C38,78 72,78 80,70 C88,62 88,48 80,40 C72,32 38,32 30,40 Z" fill="#388E3C" />
            <path d="M32,42 C25,49 25,61 32,68 C39,75 71,75 78,68 C85,61 85,49 78,42 C71,35 39,35 32,42 Z" fill="#43A047" />
            
            <!-- Pod Inner Texture -->
            <path d="M35,45 C40,40 70,40 75,45 M35,55 C40,50 70,50 75,55 M35,65 C40,60 70,60 75,65" stroke="#66BB6A" stroke-width="0.5" fill="none" />
            
            <!-- Peas with Gradients -->
            <defs>
                <radialGradient id="peaGradient1" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                    <stop offset="0%" stop-color="#C8E6C9" />
                    <stop offset="70%" stop-color="#81C784" />
                    <stop offset="100%" stop-color="#4CAF50" />
                </radialGradient>
                <radialGradient id="peaGradient2" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                    <stop offset="0%" stop-color="#C8E6C9" />
                    <stop offset="70%" stop-color="#81C784" />
                    <stop offset="100%" stop-color="#4CAF50" />
                </radialGradient>
                <radialGradient id="peaGradient3" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                    <stop offset="0%" stop-color="#C8E6C9" />
                    <stop offset="70%" stop-color="#81C784" />
                    <stop offset="100%" stop-color="#4CAF50" />
                </radialGradient>
            </defs>
            
            <!-- First Pea with Detailed Shading -->
            <circle cx="37" cy="55" r="11" fill="url(#peaGradient1)" />
            <circle cx="35" cy="53" r="3" fill="#E8F5E9" opacity="0.6" />
            <path d="M42,49 A9,9 0 0,0 32,59" stroke="#2E7D32" stroke-width="0.5" fill="none" />
            
            <!-- Second Pea with Detailed Shading -->
            <circle cx="55" cy="55" r="10" fill="url(#peaGradient2)" />
            <circle cx="53" cy="53" r="3" fill="#E8F5E9" opacity="0.6" />
            <path d="M60,49 A9,9 0 0,0 50,59" stroke="#2E7D32" stroke-width="0.5" fill="none" />
            
            <!-- Third Pea with Detailed Shading -->
            <circle cx="73" cy="55" r="10" fill="url(#peaGradient3)" />
            <circle cx="71" cy="53" r="3" fill="#E8F5E9" opacity="0.6" />
            <path d="M78,49 A9,9 0 0,0 68,59" stroke="#2E7D32" stroke-width="0.5" fill="none" />
            
            <!-- Pod Highlights -->
            <path d="M28,45 Q35,35 55,35 Q75,35 82,45" stroke="#A5D6A7" stroke-width="1" fill="none" />
            <path d="M30,42 C25,47 25,58 30,63" stroke="#E8F5E9" stroke-width="1.5" stroke-linecap="round" fill="none" />
            
            <!-- Pod Details -->
            <path d="M84,45 C87,48 88,52 88,55 M84,65 C87,62 88,58 88,55" stroke="#2E7D32" stroke-width="0.75" fill="none" />
            <path d="M24,45 C21,48 20,52 20,55 M24,65 C21,62 20,58 20,55" stroke="#2E7D32" stroke-width="0.75" fill="none" />
        </svg>`;
    } else {
        clickedCell.innerHTML = `<svg class="carrot-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
            <!-- Defs for gradients -->
            <defs>
                <linearGradient id="carrotGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FF7043" />
                    <stop offset="50%" stop-color="#FF8F00" />
                    <stop offset="100%" stop-color="#E65100" />
                </linearGradient>
                <radialGradient id="carrotTopGradient" cx="50%" cy="20%" r="60%" fx="50%" fy="20%">
                    <stop offset="0%" stop-color="#FFA726" />
                    <stop offset="100%" stop-color="#FB8C00" />
                </radialGradient>
                <filter id="carrotShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.3" />
                </filter>
            </defs>
            
            <!-- Carrot Body with Gradient -->
            <path d="M50,15 C52,15 65,30 65,50 C65,75 55,90 50,90 C45,90 35,75 35,50 C35,30 48,15 50,15 Z" fill="url(#carrotGradient)" filter="url(#carrotShadow)" />
            <path d="M50,17 C51.5,17 62,31 62,50 C62,73 54,88 50,88 C46,88 38,73 38,50 C38,31 48.5,17 50,17 Z" fill="url(#carrotTopGradient)" />
            
            <!-- Carrot Root Details -->
            <path d="M50,85 C51,85 52,87 53,90 M50,85 C49,85 48,87 47,90" stroke="#E65100" stroke-width="0.75" fill="none" />
            
            <!-- Carrot Texture Lines -->
            <path d="M44,25 C46,24 54,24 56,25 M43,35 C46,34 54,34 57,35 M42,45 C46,44 54,44 58,45 M42,55 C46,54 54,54 58,55 M43,65 C46,64 54,64 57,65 M44,75 C46,74 54,74 56,75" stroke="#EC407A" stroke-width="0.3" fill="none" />
            <path d="M46,20 C47,19 53,19 54,20 M45,30 C47,29 53,29 55,30 M44,40 C47,39 53,39 56,40 M44,50 C47,49 53,49 56,50 M44,60 C47,59 53,59 56,60 M45,70 C47,69 53,69 55,70 M46,80 C47,79 53,79 54,80" stroke="#F57C00" stroke-width="0.3" fill="none" />
            
            <!-- Carrot Segments -->
            <path d="M50,20 C45,30 45,40 50,50 C55,40 55,30 50,20" stroke="#E65100" stroke-width="0.3" fill="none" />
            <path d="M50,50 C45,60 45,70 50,80 C55,70 55,60 50,50" stroke="#E65100" stroke-width="0.3" fill="none" />
            
            <!-- Carrot Top Detail -->
            <path d="M50,15 C49,13 48,11 50,5 C52,11 51,13 50,15 Z" fill="#43A047" />
            
            <!-- Carrot Greens - Main Stems -->
            <path d="M40,7 C35,0 33,3 30,-2" stroke="#1B5E20" stroke-width="1.5" stroke-linecap="round" fill="none" />
            <path d="M45,6 C42,-2 40,1 38,-4" stroke="#1B5E20" stroke-width="1.5" stroke-linecap="round" fill="none" />
            <path d="M50,3 C50,-4 48,-1 47,-7" stroke="#1B5E20" stroke-width="1.5" stroke-linecap="round" fill="none" />
            <path d="M55,6 C58,-2 60,1 62,-4" stroke="#1B5E20" stroke-width="1.5" stroke-linecap="round" fill="none" />
            <path d="M60,7 C65,0 67,3 70,-2" stroke="#1B5E20" stroke-width="1.5" stroke-linecap="round" fill="none" />
            
            <!-- Carrot Greens - Leaves -->
            <path d="M40,7 C38,5 35,6 33,4 M40,7 C37,5 36,7 34,6" stroke="#2E7D32" stroke-width="0.75" stroke-linecap="round" fill="none" />
            <path d="M45,6 C43,4 41,4 39,2 M45,6 C42,4 42,5 40,4" stroke="#2E7D32" stroke-width="0.75" stroke-linecap="round" fill="none" />
            <path d="M50,3 C48,2 47,0 46,-1 M50,3 C47,1 47,2 45,1" stroke="#2E7D32" stroke-width="0.75" stroke-linecap="round" fill="none" />
            <path d="M55,6 C57,4 59,4 61,2 M55,6 C58,4 58,5 60,4" stroke="#2E7D32" stroke-width="0.75" stroke-linecap="round" fill="none" />
            <path d="M60,7 C62,5 65,6 67,4 M60,7 C63,5 64,7 66,6" stroke="#2E7D32" stroke-width="0.75" stroke-linecap="round" fill="none" />
        </svg>`;
    }

    // Check if move was optimal and provide feedback
    provideMoveEvaluation(clickedCellIndex, optimalMove, playerWhoMoved);

    if (checkWin()) {
        gameStatus.textContent = `Player ${playerWhoMoved} Wins!`;
        gameActive = false;
        feedbackContainer.innerHTML = '';
        return;
    }

    if (boardState.every(cell => cell !== null)) {
        gameStatus.textContent = 'Game Draw!';
        gameActive = false;
        feedbackContainer.innerHTML = '';
        return;
    }

    switchPlayer();
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'P' ? 'C' : 'P';
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    boardState = Array(9).fill(null);
    gameActive = true;
    currentPlayer = 'P';
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    feedbackContainer.innerHTML = '';
    
    cells.forEach(cell => {
        cell.innerHTML = ''; // Clear cell content
    });
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});
resetButton.addEventListener('click', resetGame);

// Add CSS styles for the recommendation marker
const style = document.createElement('style');
style.textContent = `
    .cell {
        position: relative;
    }
    .recommendation-marker {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        pointer-events: none;
        animation: pulse 1.5s infinite ease-in-out;
    }
    @keyframes pulse {
        0% { opacity: 0.2; }
        50% { opacity: 0.8; }
        100% { opacity: 0.2; }
    }
`;
document.head.appendChild(style);

// Show initial recommendation after page load
setTimeout(showRecommendedMove, 500);

// Add this function to get the best move for the current player
function getRecommendedMove() {
    // If the game is not active, no recommendation
    if (!gameActive) return -1;
    
    const emptyIndices = boardState.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
    
    // If board is empty, recommend center or corner
    if (emptyIndices.length === 9) {
        return 4; // Center is a strong opening move
    }
    
    // Check for winning moves for current player
    for (let i of emptyIndices) {
        const boardCopy = [...boardState];
        boardCopy[i] = currentPlayer;
        if (checkWinForBoard(boardCopy, currentPlayer)) {
            return i; // If we can win, that's our move
        }
    }
    
    // Check for blocking opponent's winning moves
    const opponent = currentPlayer === 'P' ? 'C' : 'P';
    for (let i of emptyIndices) {
        const boardCopy = [...boardState];
        boardCopy[i] = opponent;
        if (checkWinForBoard(boardCopy, opponent)) {
            return i; // If opponent can win, block it
        }
    }
    
    // If center is free, take it
    if (boardState[4] === null) {
        return 4;
    }
    
    // Take available corners
    const corners = [0, 2, 6, 8].filter(i => boardState[i] === null);
    if (corners.length > 0) {
        return corners[0];
    }
    
    // Take any available edges
    const edges = [1, 3, 5, 7].filter(i => boardState[i] === null);
    if (edges.length > 0) {
        return edges[0];
    }
    
    // If we get here, no move is available
    return -1;
}

// Helper function to check if a specific board state has a win
function checkWinForBoard(board, player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === player && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

// Add this function to show the recommended move
function showRecommendedMove() {
    // Clear previous recommendation
    clearRecommendation();
    
    // Get the recommended move for current player
    const recommendedIndex = getRecommendedMove();
    if (recommendedIndex === -1) return;
    
    // Find the cell and add a visual hint
    const cell = document.querySelector(`[data-index="${recommendedIndex}"]`);
    if (!cell) return;
    
    // Add a recommendation marker
    const recommendationMarker = document.createElement('div');
    recommendationMarker.className = 'recommendation-marker';
    
    if (currentPlayer === 'P') {
        recommendationMarker.innerHTML = `
            <svg class="hint-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="30" height="30" opacity="0.4">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#4CAF50" stroke-width="3" stroke-dasharray="10,5" />
                <text x="50" y="55" text-anchor="middle" font-family="Arial" font-size="12" fill="#4CAF50">HINT</text>
            </svg>
        `;
    } else {
        recommendationMarker.innerHTML = `
            <svg class="hint-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="30" height="30" opacity="0.4">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#FF8F00" stroke-width="3" stroke-dasharray="10,5" />
                <text x="50" y="55" text-anchor="middle" font-family="Arial" font-size="12" fill="#FF8F00">HINT</text>
            </svg>
        `;
    }
    
    cell.appendChild(recommendationMarker);
}

// Clear any existing recommendation markers
function clearRecommendation() {
    const markers = document.querySelectorAll('.recommendation-marker');
    markers.forEach(marker => marker.remove());
}

// Provide feedback on move quality
function provideMoveEvaluation(actualMove, optimalMove, player) {
    const playerName = player === 'P' ? 'Pea' : 'Carrot';
    const playerColor = player === 'P' ? '#4CAF50' : '#FF8F00';
    
    if (actualMove === optimalMove) {
        feedbackContainer.innerHTML = `
            <div style="color: ${playerColor}; background-color: rgba(0,200,0,0.1); padding: 8px; border-radius: 4px;">
                <svg height="20" width="20" style="vertical-align: middle;">
                    <circle cx="10" cy="10" r="8" fill="none" stroke="${playerColor}" stroke-width="2"/>
                    <path d="M6,10 L9,13 L14,7" stroke="${playerColor}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Perfect move, ${playerName}! That was the optimal choice.</span>
            </div>
        `;
    } else {
        // Calculate the row and column for display purposes (0-based to 1-based)
        const optimalRow = Math.floor(optimalMove / 3) + 1;
        const optimalCol = (optimalMove % 3) + 1;
        
        feedbackContainer.innerHTML = `
            <div style="color: ${playerColor}; background-color: rgba(255,200,0,0.1); padding: 8px; border-radius: 4px;">
                <svg height="20" width="20" style="vertical-align: middle;">
                    <circle cx="10" cy="10" r="8" fill="none" stroke="${playerColor}" stroke-width="2"/>
                    <path d="M7,7 L13,13 M7,13 L13,7" stroke="${playerColor}" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Not the optimal move, ${playerName}. The best move would have been position (${optimalRow},${optimalCol}).</span>
            </div>
        `;
        
        // Briefly highlight the optimal position
        const optimalCell = document.querySelector(`[data-index="${optimalMove}"]`);
        if (optimalCell && boardState[optimalMove] === null) {
            const highlight = document.createElement('div');
            highlight.className = 'optimal-highlight';
            highlight.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="${playerColor}" stroke-width="2" stroke-dasharray="5,5" />
                    <text x="50" y="55" text-anchor="middle" font-family="Arial" font-size="12" fill="${playerColor}">OPTIMAL</text>
                </svg>
            `;
            highlight.style.position = 'absolute';
            highlight.style.top = '50%';
            highlight.style.left = '50%';
            highlight.style.transform = 'translate(-50%, -50%)';
            highlight.style.opacity = '0.6';
            highlight.style.pointerEvents = 'none';
            
            optimalCell.style.position = 'relative';
            optimalCell.appendChild(highlight);
            
            setTimeout(() => {
                highlight.remove();
            }, 2000);
        }
    }
    
    // Clear feedback after a delay
    setTimeout(() => {
        if (gameActive) {
            feedbackContainer.innerHTML = '';
        }
    }, 3000);
}

// Get the optimal move for a given board state and player
function getOptimalMove(board, player) {
    const emptyIndices = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
    
    // If board is empty, recommend center or corner
    if (emptyIndices.length === 9) {
        return 4; // Center is a strong opening move
    }
    
    // Check for winning moves for current player
    for (let i of emptyIndices) {
        const boardCopy = [...board];
        boardCopy[i] = player;
        if (checkWinForBoard(boardCopy, player)) {
            return i; // If we can win, that's our move
        }
    }
    
    // Check for blocking opponent's winning moves
    const opponent = player === 'P' ? 'C' : 'P';
    for (let i of emptyIndices) {
        const boardCopy = [...board];
        boardCopy[i] = opponent;
        if (checkWinForBoard(boardCopy, opponent)) {
            return i; // If opponent can win, block it
        }
    }
    
    // If center is free, take it
    if (board[4] === null) {
        return 4;
    }
    
    // Take available corners
    const corners = [0, 2, 6, 8].filter(i => board[i] === null);
    if (corners.length > 0) {
        return corners[0];
    }
    
    // Take any available edges
    const edges = [1, 3, 5, 7].filter(i => board[i] === null);
    if (edges.length > 0) {
        return edges[0];
    }
    
    // If we get here, no move is available
    return -1;
} 