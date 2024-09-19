const canvas = document.getElementById('gameOfLifeCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

const resolution = 10;  // size of each cell
canvas.width = 800;
canvas.height = 600;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

let grid = [];
// Wait until the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameOfLifeCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const setCanvasSizeButton = document.getElementById('setCanvasSizeButton');
    const canvasWidthInput = document.getElementById('canvasWidth');
    const canvasHeightInput = document.getElementById('canvasHeight');

    let resolution = 10;  // size of each cell
    let COLS, ROWS;
    let grid = [];

    // Function to build the grid based on the set dimensions
    function buildGrid() {
        return new Array(COLS).fill(null)
            .map(() => new Array(ROWS).fill(null)
            .map(() => Math.floor(Math.random() * 2)));
    }

    function drawGrid(grid) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS; row++) {
                const cell = grid[col][row];
                ctx.beginPath();
                ctx.rect(col * resolution, row * resolution, resolution, resolution);
                ctx.fillStyle = cell ? 'white' : 'black';
                ctx.fill();
                ctx.strokeStyle = '#001d3d';  // Optional: Change this to match your design
                ctx.stroke();
            }
        }
    }

    function updateGrid(grid) {
        const nextGrid = grid.map(arr => [...arr]);

        for (let col = 0; col < grid.length; col++) {
            for (let row = 0; row < grid[col].length; row++) {
                const cell = grid[col][row];
                let numNeighbors = 0;

                // Count the neighbors
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (i === 0 && j === 0) continue;
                        const x_cell = col + i;
                        const y_cell = row + j;

                        // Ensure we count neighbors within the bounds
                        if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
                            numNeighbors += grid[x_cell][y_cell];
                        }
                    }
                }

                // Apply Conway's rules
                if (cell === 1 && (numNeighbors < 2 || numNeighbors > 3)) {
                    nextGrid[col][row] = 0;
                } else if (cell === 0 && numNeighbors === 3) {
                    nextGrid[col][row] = 1;
                }
            }
        }

        return nextGrid;
    }

    function update() {
        grid = updateGrid(grid);
        drawGrid(grid);
    }

    // Event listener to set the canvas size
    setCanvasSizeButton.addEventListener('click', () => {
        const width = parseInt(canvasWidthInput.value, 10);
        const height = parseInt(canvasHeightInput.value, 10);

        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            alert('Please enter valid positive numbers for both width and height.');
            return;
        }

        // Update canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Calculate the number of columns and rows based on the canvas size
        COLS = Math.floor(canvas.width / resolution);
        ROWS = Math.floor(canvas.height / resolution);

        canvas.style.display = 'block';  // Show the canvas
        startButton.style.display = 'block';  // Show the start button
    });

    // Event listener to start the game when the "GOL" button is clicked
    startButton.addEventListener('click', () => {
        grid = buildGrid();  // Build the grid only when the button is clicked
        drawGrid(grid); // Ensure the grid is drawn immediately after start
        startButton.style.display = 'none';  // Hide the start button after the game starts
        setInterval(update, 100);  // Start the game loop
    });
});
