// Gaussian Elimination Game
// Game state
let currentSize = 3;
let matrix = [];
let solution = [];
let operationHistory = [];
let selectedRow = null;
let selectedOperation = null;
let scalarValue = 1;
let draggedRow = null;

// Global state for drag operation
let isDraggingPreview = false;
let currentDifficulty = 'medium'; // Default difficulty

// Fraction class for precise arithmetic
class Fraction {
    constructor(numerator, denominator = 1) {
        if (denominator === 0) throw new Error("Denominator cannot be zero");
        
        // Handle negative denominators
        if (denominator < 0) {
            numerator = -numerator;
            denominator = -denominator;
        }
        
        const gcd = this.gcd(Math.abs(numerator), Math.abs(denominator));
        this.num = numerator / gcd;
        this.den = denominator / gcd;
    }
    
    gcd(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    }
    
    add(other) {
        return new Fraction(
            this.num * other.den + other.num * this.den,
            this.den * other.den
        );
    }
    
    multiply(other) {
        return new Fraction(this.num * other.num, this.den * other.den);
    }
    
    negate() {
        return new Fraction(-this.num, this.den);
    }
    
    toString() {
        if (this.den === 1) return this.num.toString();
        return `${this.num}/${this.den}`;
    }
    
    toFloat() {
        return this.num / this.den;
    }
    
    static fromString(str) {
        str = str.trim();
        if (str.includes('/')) {
            const parts = str.split('/');
            const num = parseInt(parts[0]);
            const den = parseInt(parts[1]);
            if (isNaN(num) || isNaN(den)) {
                throw new Error("Invalid fraction");
            }
            return new Fraction(num, den);
        }
        return new Fraction(parseInt(str) || 0);
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    setupConfiguration();
    setupButtons();
});

function setupConfiguration() {
    // Size buttons
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSize = parseInt(btn.dataset.size);
        });
    });

    // Difficulty buttons
    const diffButtons = document.querySelectorAll('.diff-btn');
    diffButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            diffButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDifficulty = btn.dataset.difficulty;
        });
    });

    // Start Game button
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startNewGame);
    }
}

function setupButtons() {
    document.getElementById('new-problem-btn').addEventListener('click', startNewGame);
    document.getElementById('undo-btn').addEventListener('click', undoLastOperation);
    document.getElementById('multiply-btn').addEventListener('click', () => setOperation('multiply'));
    document.getElementById('add-row-btn').addEventListener('click', () => setOperation('add'));
    document.getElementById('cancel-btn').addEventListener('click', cancelOperation);
    document.getElementById('check-solution-btn').addEventListener('click', checkSolution);
    document.getElementById('scalar-input').addEventListener('input', updateScalar);
    document.getElementById('hint-btn').addEventListener('click', showHint);
}

function showHint() {
    const hint = getHint();
    const hintDisplay = document.getElementById('hint-display');
    const hintText = document.getElementById('hint-text');
    
    hintText.textContent = hint;
    hintDisplay.style.display = 'block';
    
    // Auto-hide after 8 seconds
    if (window.hintTimeout) clearTimeout(window.hintTimeout);
    window.hintTimeout = setTimeout(() => {
        hintDisplay.style.display = 'none';
    }, 8000);
}

function getHint() {
    // 1. Find the first column that isn't done
    for (let j = 0; j < currentSize; j++) {
        const pivot = matrix[j][j];
        
        // Check if pivot is 0
        if (pivot.num === 0) {
            // Find a row below to swap
            for (let k = j + 1; k < currentSize; k++) {
                if (matrix[k][j].num !== 0) {
                    return `Row ${j + 1} has a zero pivot. Swap it with Row ${k + 1}.`;
                }
            }
            continue; // Singular or all zeros below, move to next col
        }
        
        // Check if pivot is 1
        if (pivot.num !== pivot.den && (pivot.num !== 1 || pivot.den !== 1)) {
            // Suggest scaling
            // To get 1, we multiply by reciprocal
            const reciprocal = new Fraction(pivot.den, pivot.num);
            return `Make the pivot at (${j+1},${j+1}) a 1 by multiplying Row ${j + 1} by ${reciprocal}.`;
        }
        
        // Check if other entries in column are 0
        for (let k = 0; k < currentSize; k++) {
            if (k === j) continue;
            if (matrix[k][j].num !== 0) {
                const targetVal = matrix[k][j];
                const scalar = targetVal.negate();
                return `Eliminate the ${targetVal} in Row ${k+1} by adding (${scalar} × Row ${j+1}) to it.`;
            }
        }
    }
    
    return "The matrix appears to be in Reduced Row Echelon Form. Enter the values in the rightmost column as the solution!";
}

function startNewGame() {
    operationHistory = [];
    selectedRow = null;
    selectedOperation = null;
    document.getElementById('undo-btn').disabled = true;
    // Always show solution section so users can solve via back-substitution if they wish
    document.getElementById('solution-section').style.display = 'block';
    document.getElementById('result-message').textContent = '';
    
    // Show/hide z and w fields based on size
    document.getElementById('z-field').style.display = currentSize >= 3 ? 'block' : 'none';
    document.getElementById('w-field').style.display = currentSize >= 4 ? 'block' : 'none';
    
    generateMatrix();
    renderMatrix();
    
    const setupScreen = document.getElementById('setup-screen');
    if (setupScreen) setupScreen.style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
}

function generateMatrix() {
    // Determine complexity based on difficulty
    let range = 5;
    let sparsity = 0;
    
    // Set parameters based on Difficulty
    if (currentDifficulty === 'easy') {
        range = 4; // -2 to 2 (approx)
        sparsity = 0.3; // Higher chance of zeros for easier arithmetic
    } else if (currentDifficulty === 'medium') {
        range = 8; // -4 to 4
        sparsity = 0.15;
    } else { // Hard
        range = 15; // -7 to 7
        sparsity = 0.05;
    }
    
    // Generate a random system with integer solution
    solution = [];
    for (let i = 0; i < currentSize; i++) {
        // Solution components usually small integers for playability
        solution.push(new Fraction(Math.floor(Math.random() * 7) - 3)); 
    }
    
    // Generate coefficient matrix
    matrix = [];
    for (let i = 0; i < currentSize; i++) {
        let row = [];
        let validRow = false;
        
        // Ensure no row is all zeros
        while (!validRow) {
            row = [];
            let allZeros = true;
            for (let j = 0; j < currentSize; j++) {
                if (Math.random() < sparsity) {
                    row.push(new Fraction(0));
                } else {
                    const val = Math.floor(Math.random() * range) - Math.floor(range/2);
                    if (val !== 0) allZeros = false;
                    row.push(new Fraction(val));
                }
            }
            if (!allZeros) validRow = true;
        }
        
        // Calculate b value (Ax = b)
        let b = new Fraction(0);
        for (let j = 0; j < currentSize; j++) {
            b = b.add(row[j].multiply(solution[j]));
        }
        row.push(b); // Augmented column
        
        matrix.push(row);
    }
}

function renderMatrix() {
    const table = document.getElementById('matrix-table');
    table.innerHTML = '';
    
    matrix.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        tr.dataset.row = rowIndex;
        tr.draggable = true;
        
        // Add drag event listeners
        tr.addEventListener('dragstart', handleDragStart);
        tr.addEventListener('dragover', handleDragOver);
        tr.addEventListener('dragleave', handleDragLeave);
        tr.addEventListener('drop', handleDrop);
        tr.addEventListener('dragend', handleDragEnd);
        tr.addEventListener('click', () => selectRow(rowIndex));
        
        row.forEach((value, colIndex) => {
            const td = document.createElement('td');
            td.textContent = value.toString();
            
            // Add divider class before last column
            if (colIndex === currentSize - 1) {
                td.classList.add('before-divider');
            }
            if (colIndex === currentSize) {
                td.classList.add('augment-column');
            }
            
            tr.appendChild(td);
        });
        
        table.appendChild(tr);
    });
}

function selectRow(rowIndex) {
    // Deselect if clicking same row
    if (selectedRow === rowIndex) {
        deselectRow();
        return;
    }
    
    // Clear previous selection
    document.querySelectorAll('tr').forEach(tr => tr.classList.remove('selected'));
    
    // Select new row
    selectedRow = rowIndex;
    const row = document.querySelector(`tr[data-row="${rowIndex}"]`);
    row.classList.add('selected');
    
    // Show toolbar
    document.getElementById('operation-toolbar').style.display = 'block';
}

function deselectRow() {
    // Restore draggability to selected row
    if (selectedRow !== null) {
        const table = document.getElementById('matrix-table');
        const selectedTr = table.querySelector(`tr[data-row="${selectedRow}"]`);
        if (selectedTr) {
            selectedTr.draggable = true;
            selectedTr.style.cursor = '';
        }
    }
    
    selectedRow = null;
    selectedOperation = null;
    document.querySelectorAll('tr').forEach(tr => tr.classList.remove('selected'));
    document.getElementById('operation-toolbar').style.display = 'none';
    
    // Remove preview row if exists
    const previewRow = document.getElementById('preview-row');
    if (previewRow) previewRow.remove();
}

function setOperation(operation) {
    selectedOperation = operation;
    updateScalar();
    
    // Visual feedback
    document.querySelectorAll('.operation-btn').forEach(btn => btn.classList.remove('active'));
    if (operation === 'multiply') {
        document.getElementById('multiply-btn').classList.add('active');
        // Multiply operation executes immediately
        performMultiply();
    } else {
        document.getElementById('add-row-btn').classList.add('active');
        // Add operation shows preview row
        showPreviewRow();
    }
}

function performMultiply() {
    if (selectedRow === null) return;
    
    saveState();
    
    // Multiply selected row by scalar
    for (let i = 0; i <= currentSize; i++) {
        matrix[selectedRow][i] = matrix[selectedRow][i].multiply(scalarValue);
    }
    
    renderMatrix();
    deselectRow();
    checkRREF();
}

function showPreviewRow() {
    if (selectedRow === null) return;
    
    // Remove any existing preview
    const existingPreview = document.getElementById('preview-row');
    if (existingPreview) existingPreview.remove();
    
    // Create preview row showing scaled values
    const table = document.getElementById('matrix-table');
    const selectedTr = table.querySelector(`tr[data-row="${selectedRow}"]`);
    
    // Make selected row non-draggable during add operation
    selectedTr.draggable = false;
    selectedTr.style.cursor = 'default';
    
    const previewTr = document.createElement('tr');
    previewTr.id = 'preview-row';
    previewTr.classList.add('preview-row');
    previewTr.draggable = true;
    previewTr.dataset.isPreview = 'true';
    previewTr.dataset.sourceRow = selectedRow; // Store source row
    
    // Add drag event listeners
    previewTr.addEventListener('dragstart', handlePreviewDragStart);
    previewTr.addEventListener('dragend', handleDragEnd);
    
    // Calculate and display scaled values
    matrix[selectedRow].forEach((value, colIndex) => {
        const td = document.createElement('td');
        const scaledValue = value.multiply(scalarValue);
        td.textContent = scaledValue.toString();
        
        if (colIndex === currentSize - 1) {
            td.classList.add('before-divider');
        }
        if (colIndex === currentSize) {
            td.classList.add('augment-column');
        }
        
        previewTr.appendChild(td);
    });
    
    // Insert preview row after selected row
    selectedTr.after(previewTr);
    
    // Position it to stack on top of the selected row - cleaner, centered alignment
    setTimeout(() => {
        previewTr.style.position = 'absolute';
        previewTr.style.top = `${selectedTr.offsetTop - 6}px`; // Slight lift
        previewTr.style.left = `${selectedTr.offsetLeft}px`; // Perfectly aligned
        previewTr.style.width = `${selectedTr.offsetWidth}px`;
        previewTr.style.zIndex = '100';
    }, 0);
}

function updateScalar() {
    const input = document.getElementById('scalar-input').value;
    try {
        scalarValue = Fraction.fromString(input);
    } catch (e) {
        scalarValue = new Fraction(1);
    }
    
    // Refresh preview row if in add mode
    if (selectedOperation === 'add') {
        showPreviewRow();
    }
}

function cancelOperation() {
    deselectRow();
}

// Drag and drop handlers
function handlePreviewDragStart(e) {
    draggedRow = parseInt(e.target.dataset.sourceRow);
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('isPreview', 'true');
    isDraggingPreview = true;
    
    // Crucial: Allow events to pass through this element to underlying rows
    setTimeout(() => {
        e.target.style.pointerEvents = 'none';
        e.target.style.opacity = '0'; // Visual feedback
    }, 0);
}

function handleDragStart(e) {
    if (e.target.dataset.isPreview) {
        // Should be handled by handlePreviewDragStart but safety check
        handlePreviewDragStart(e);
        return;
    } 
    
    draggedRow = parseInt(e.target.dataset.row);
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    isDraggingPreview = false;
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    e.target.style.pointerEvents = ''; // Restore events
    e.target.style.opacity = '';
    isDraggingPreview = false;
    
    // Clear all highlights forcefully
    document.querySelectorAll('tr').forEach(tr => tr.classList.remove('drop-target'));
}

function handleDragOver(e) {
    e.preventDefault();
    const targetRow = parseInt(e.currentTarget.dataset.row);
    
    // Show drop target highlight if valid
    if (canDrop(targetRow)) {
        e.currentTarget.classList.add('drop-target');
        // Match the effectAllowed from dragStart
        e.dataTransfer.dropEffect = isDraggingPreview ? 'copy' : 'move';
    } else {
        e.dataTransfer.dropEffect = 'none';
    }
}

function handleDragLeave(e) {
    // Only remove if we're actually leaving the element (not entering a child)
    if (e.currentTarget.contains(e.relatedTarget)) return;
    e.currentTarget.classList.remove('drop-target');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Get the closest row element in case we dropped on a child td
    const tr = e.target.closest('tr');
    if (!tr || !tr.hasAttribute('data-row')) return;
    
    const targetRow = parseInt(tr.dataset.row);
    
    // Check various ways to detect preview drop
    const draggingElement = document.querySelector('.dragging');
    const isPreviewDrop = isDraggingPreview;
    
    // Explicitly check for valid drop condition
    if (!canDrop(targetRow)) {
        flashInvalid(tr);
        document.querySelectorAll('tr').forEach(t => t.classList.remove('drop-target'));
        return;
    }

    if (isPreviewDrop) {
        performAddOperation(targetRow);
    } else if (selectedRow !== null && selectedOperation) {
        // Fallback or safety
        performRowOperation(selectedRow, targetRow);
    } else {
        // Row swap
        swapRows(draggedRow, targetRow);
    }
    
    // Cleanup
    document.querySelectorAll('tr').forEach(t => t.classList.remove('drop-target'));
}

function performRowOperation(sourceRow, targetRow) {
    // This function is now mainly for backward compatibility
    // Multiply is handled immediately, add uses preview row
    if (selectedOperation === 'add') {
        performAddOperation(targetRow);
    }
}

function swapRows(row1, row2) {
    // Save state for undo
    saveState();
    
    // Swap
    const temp = matrix[row1];
    matrix[row1] = matrix[row2];
    matrix[row2] = temp;
    
    renderMatrix();
    deselectRow();
    checkRREF();
}

function performAddOperation(targetRow) {
    if (selectedRow === null) {
        console.error('selectedRow is null in performAddOperation');
        return;
    }
    
    saveState();
    
    // Add (scalar * source row) to target row
    for (let i = 0; i <= currentSize; i++) {
        const term = matrix[selectedRow][i].multiply(scalarValue);
        matrix[targetRow][i] = matrix[targetRow][i].add(term);
    }
    
    renderMatrix();
    deselectRow();
    checkRREF();
}

function flashInvalid(element) {
    element.classList.add('incorrect-flash');
    setTimeout(() => element.classList.remove('incorrect-flash'), 800);
}

function saveState() {
    // Deep copy matrix
    const stateCopy = matrix.map(row => row.map(val => new Fraction(val.num, val.den)));
    operationHistory.push(stateCopy);
    document.getElementById('undo-btn').disabled = false;
}

function undoLastOperation() {
    if (operationHistory.length === 0) return;
    
    matrix = operationHistory.pop();
    renderMatrix();
    
    if (operationHistory.length === 0) {
        document.getElementById('undo-btn').disabled = true;
    }
    
    // Force deselect to clear any weird state
    if (selectedRow !== null) deselectRow();
    
    checkRREF();
}

function checkRREF() {
    // Check if matrix is in RREF
    let isRREF = true;
    
    for (let i = 0; i < currentSize; i++) {
        // Diagonal should be 1
        if (matrix[i][i].num !== 1 || matrix[i][i].den !== 1) {
            isRREF = false;
            break;
        }
        
        // Check zeros above and below diagonal
        for (let j = 0; j < currentSize; j++) {
            if (i !== j && (matrix[j][i].num !== 0)) {
                isRREF = false;
                break;
            }
        }
    }
    
    if (isRREF) {
        // Visual feedback when RREF is achieved
        document.getElementById('matrix-table').classList.add('rref-complete');
        
        // Auto-fill solution inputs using the augmented column values
        const inputIds = ['x-input', 'y-input', 'z-input', 'w-input'];
        for (let i = 0; i < currentSize; i++) {
            const inputEl = document.getElementById(inputIds[i]);
            if (inputEl) {
                // The value is in the last column (index currentSize)
                inputEl.value = matrix[i][currentSize].toString();
            }
        }
    } else {
        document.getElementById('matrix-table').classList.remove('rref-complete');
    }
}

function checkSolution() {
    const inputs = [
        document.getElementById('x-input').value,
        document.getElementById('y-input').value,
        currentSize >= 3 ? document.getElementById('z-input').value : null,
        currentSize >= 4 ? document.getElementById('w-input').value : null
    ];
    
    let allCorrect = true;
    const resultDiv = document.getElementById('result-message');
    
    for (let i = 0; i < currentSize; i++) {
        try {
            const userAnswer = Fraction.fromString(inputs[i]);
            const correctAnswer = solution[i]; // Compare against original solution
            
            if (userAnswer.num !== correctAnswer.num || userAnswer.den !== correctAnswer.den) {
                allCorrect = false;
                break;
            }
        } catch (e) {
            allCorrect = false;
            break;
        }
    }
    
    if (allCorrect) {
        resultDiv.textContent = ' Correct! Well done!';
        resultDiv.classList.remove('incorrect');
        resultDiv.classList.add('correct');
        
        // Celebration animation
        document.getElementById('solution-section').classList.add('pop');
        setTimeout(() => document.getElementById('solution-section').classList.remove('pop'), 600);
    } else {
        resultDiv.textContent = ' Not quite right. Keep trying!';
        resultDiv.classList.remove('correct');
        resultDiv.classList.add('incorrect');
    }
}

function canDrop(targetRow) {
    // Use consistent global state
    if (isDraggingPreview) {
        return targetRow !== selectedRow; // Assuming draggedRow is correctly set to sourceRow
    }
    
    if (draggedRow === targetRow) return false;
    
    // If no operation selected, allow swap to any other row
    if (selectedRow === null || !selectedOperation) return true;
    
    // If operation selected, source must be selected row
    if (draggedRow !== selectedRow) return false;
    
    return true;
}
