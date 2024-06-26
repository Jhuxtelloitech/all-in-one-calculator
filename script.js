let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');
const EN = 2.71828;
const PI = 3.14159;
let arr = Array.from(buttons);

function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
}

function calculateExpression(expression) {
    try {
        let result = eval(expression.replaceAll('^', '**').replaceAll('x', '*').replaceAll('÷', '/').replaceAll('e', EN).replaceAll('π', PI));
        result = parseFloat(result).toString();
        speak(`The answer is ${result}`);
        input.value = result;
    } catch (error) {
        speak("Error");
        input.value = "Error";
    }
}

function factorial(n) {
    if (n === 0 || n === 1)
        return 1;
    for (let i = n - 1; i >= 1; i--) {
        n *= i;
    }
    return n;
}

arr.forEach(button => {
    button.addEventListener('click', (e) => {
        let buttonText = e.target.innerHTML.trim();
        let spokenText = buttonText;

        switch (buttonText) {
            case '+':
                spokenText = 'plus';
                input.value += ' + ';
                break;
            case '-':
                spokenText = 'minus';
                input.value += ' - ';
                break;
            case 'x':
                spokenText = 'times';
                input.value += ' x ';
                break;
            case '÷':
                spokenText = 'divided by';
                input.value += ' ÷ ';
                break;
            case '^':
                spokenText = 'to the power of';
                input.value += ' ^ ';
                break;
            case '=':
                spokenText = 'equals';
                calculateExpression(input.value);
                break;
            case 'π':
                spokenText = 'pi';
                input.value += PI;
                break;
            case 'e':
                spokenText = 'euler\'s number';
                input.value += EN;
                break;
            case '(':
                spokenText = 'left parenthesis';
                input.value += '(';
                break;
            case ')':
                spokenText = 'right parenthesis';
                input.value += ')';
                break;
            case '.':
                spokenText = 'dot';
                input.value += '.';
                break;
            case 'AC':
                spokenText = 'all clear';
                input.value = '';
                break;
            case 'DEL':
                spokenText = 'delete';
                input.value = input.value.slice(0, -1);
                break;
            case 'sin':
                spokenText = 'sine';
                input.value = Math.sin(parseFloat(input.value)).toString();
                break;
            case 'cos':
                spokenText = 'cosine';
                input.value = Math.cos(parseFloat(input.value)).toString();
                break;
            case 'tan':
                spokenText = 'tangent';
                input.value = Math.tan(parseFloat(input.value)).toString();
                break;
            case 'log':
                spokenText = 'logarithm';
                input.value = Math.log10(parseFloat(input.value)).toString();
                break;
            case 'sqrt':
                spokenText = 'square root';
                input.value = Math.sqrt(parseFloat(input.value)).toString();
                break;
            case 'exp':
                spokenText = 'exponential';
                input.value = Math.exp(parseFloat(input.value)).toString();
                break;
            case '!':
                spokenText = 'factorial';
                input.value = factorial(parseFloat(input.value)).toString();
                break;
            case '^2':
                spokenText = 'square';
                input.value = Math.pow(parseFloat(input.value), 2).toString();
                break;
            default:
                if ('0123456789'.includes(buttonText) || buttonText === '.') {
                    input.value += buttonText;
                }
                break;
        }

        speak(spokenText);
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    let key = e.key;
    if ('0123456789+-*/().'.includes(key)) {
        input.value += key;
        speak(key);
    } else if (key === 'Enter') {
        calculateExpression(input.value);
    } else if (key === 'Backspace') {
        input.value = input.value.slice(0, -1);
        speak('delete');
    } else if (key === 'Escape') {
        input.value = '';
        speak('all clear');
    }
});

// Audio Guide
document.getElementById('audioGuideBtn').addEventListener('click', () => {
    speak(`Welcome to the accessible calculator. To use this calculator, you can click on the buttons or use the following keyboard shortcuts:
        For numbers and basic operations, use the corresponding keys on your keyboard.
        For advanced functions, use the following keys:
        S for sine, C for cosine, T for tangent, L for logarithm, R for square root, E for exponential, F for factorial, and Q for square.
        Press Enter to calculate the result. Press Backspace to delete the last character, and Escape to clear the input.`);
});

// Voice Input
document.getElementById('voiceInputBtn').addEventListener('click', () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log(`Transcript: ${transcript}`);
            let spokenExpression = transcript.toLowerCase()
                .replace('plus', '+')
                .replace('minus', '-')
                .replace('multiply by', 'x')
                .replace('times', 'x')
                .replace('divide by', '÷')
                .replace('divided by', '÷')
                .replace('to the power of', '^')
                .replace('pi', 'π')
                .replace('euler\'s number', 'e')
                .replace('left parenthesis', '(')
                .replace('right parenthesis', ')')
                .replace('square root', 'sqrt')
                .replace('exponential', 'exp')
                .replace('factorial', '!')
                .replace('square', '^2');

            console.log(`Parsed Expression: ${spokenExpression}`);
            input.value = spokenExpression;

            // Check if the transcript ends with 'equals' to immediately calculate the expression
            if (transcript.endsWith('equals')) {
                calculateExpression(input.value);
            } else {
                // Otherwise, speak the parsed expression
                speak(spokenExpression);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech Recognition Error:', event.error);
            speak('Sorry, I did not catch that. Please try again.');
        };

        recognition.onaudioend = () => {
            console.log('Audio capture ended.');
        };

    } else {
        console.error('Speech Recognition API is not supported in this browser.');
        speak('Speech Recognition API is not supported in this browser.');
    }
});
