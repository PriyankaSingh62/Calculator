let display = document.getElementById('display');
let currentInput = '';
let shouldResetDisplay = false;

function updateDisplay() {
    display.value = currentInput || '0';
}

function clearDisplay() {
    currentInput = '';
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    }
}

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    if (value === '.' && currentInput.includes('.')) {
        return;
    }
    
    if (isOperator(value)) {
        const lastChar = currentInput[currentInput.length - 1];
        if (isOperator(lastChar)) {
            currentInput = currentInput.slice(0, -1);
        }
    }
    
    currentInput += value;
    updateDisplay();
}

function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

function calculate() {
    if (currentInput === '') {
        return;
    }
    
    try {
        const result = evaluateExpression(currentInput);
        currentInput = result.toString();
        shouldResetDisplay = true;
        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        shouldResetDisplay = true;
        updateDisplay();
    }
}

function evaluateExpression(expression) {
    expression = expression.replace(/×/g, '*');
    
    const sanitizedExpression = expression.replace(/[^0-9+\-*/.]/g, '');
    
    if (sanitizedExpression !== expression) {
        throw new Error('Invalid characters in expression');
    }
    
    if (sanitizedExpression === '') {
        throw new Error('Empty expression');
    }
    
    const result = Function('"use strict"; return (' + sanitizedExpression + ')')();
    
    if (!isFinite(result)) {
        throw new Error('Invalid result');
    }
    
    return Math.round(result * 100000000) / 100000000;
}

document.addEventListener('keydown', function(event) {
    if (event.key >= '0' && event.key <= '9') {
        appendToDisplay(event.key);
    } else if (event.key === '.') {
        appendToDisplay('.');
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        appendToDisplay(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
        clearDisplay();
    } else if (event.key === 'Backspace') {
        deleteLast();
    }
});

display.addEventListener('focus', function() {
    this.blur();
});

updateDisplay();