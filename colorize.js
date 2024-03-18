let includeEscapeCharacters = false;

let startColorGlobal = "#0033CC";
let endColorGlobal = "#33FFFF";

let isColorCardOpen = false;
let isOptionsCardOpen = false;




function toggleEscapeCharacters() {
    includeEscapeCharacters = !includeEscapeCharacters;
    document.getElementById('toggleEscape').textContent = includeEscapeCharacters ? "Exclude \\" : "Include \\";
    
    colorizeAndDisplay();
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[name="interpolation"]').forEach(radio => {
        radio.addEventListener('change', function() {
            colorizeAndDisplay(this.value);
        });
    });

    document.getElementById('inputString').addEventListener('input', function() {
        colorizeAndDisplay();
    });

    colorizeAndDisplay(document.querySelector('[name="interpolation"]:checked').value);

    document.getElementById('startColor').addEventListener('input', applyColorChanges);
    document.getElementById('endColor').addEventListener('input', applyColorChanges);
    
    function applyColorChanges() {
        const startColor = document.getElementById('startColor').value;
        const endColor = document.getElementById('endColor').value;
        
        startColorGlobal = startColor;
        endColorGlobal = endColor;
        
        colorizeAndDisplay();
    }
});

function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return {r, g, b};
}    

function interpolateColors(steps, type) {
    let colorArray = [];
    const {r: sR, g: sG, b: sB} = hexToRgb(startColorGlobal);
    const {r: eR, g: eG, b: eB} = hexToRgb(endColorGlobal);

    for (let step = 0; step < steps; ++step) {
        let t = step / (steps - 1);
        t = applyInterpolation(t, type);

        const r = Math.round(sR + (eR - sR) * t).toString(16).padStart(2, '0');
        const g = Math.round(sG + (eG - sG) * t).toString(16).padStart(2, '0');
        const b = Math.round(sB + (eB - sB) * t).toString(16).padStart(2, '0');
        colorArray.push(`#${r}${g}${b}`);
    }
    return colorArray;
}

function applyInterpolation(t, type) {
    switch(type) {
        case 'Quadratic':
            return t * t;
        case 'InverseQuadratic':
            return 1 - (1 - t) * (1 - t);
        case 'Quartic':
            return t * t * t * t;
        case 'InverseQuartic':
            return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t);
        case 'Quintic':
            return t * t * t * t * t;
        case 'InverseQuintic':
            return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t) * (1 - t);
        case 'Sinusoidal':
            return (Math.sin(t * Math.PI - Math.PI / 2) + 1) / 2;
        case 'Cubic':
            return t * t * (3 - 2 * t);
        case 'InverseCubic':
            return 1 - t * t * (3 - 2 * t);
        case 'CubicBezier':
            return 3 * t * t - 2 * t * t * t;
        case 'InverseCubicBezier':
            return 1 - 3 * (1 - t) * (1 - t) + 2 * (1 - t) * (1 - t) * (1 - t);
        case 'QuadraticBezier':
            return 1 - (1 - t) * (1 - t);
        case 'InverseQuadraticBezier':
            return t * t;
        case 'QuarticBezier':
            return 2 * t * t * t - 3 * t * t + 1;
        case 'InverseQuarticBezier':
            return 1 - (2 * t * t * t - 3 * t * t + 1);
        case 'QuinticBezier':
            return t * t * t * t * t;
        case 'InverseQuinticBezier':
            return 1 - t * t * t * t * t;
        case 'Exponential':
            return Math.pow(t, 3);
        case 'InverseExponential':
            return 1 - Math.pow(1 - t, 3);
        case 'Sine':
            return Math.sin(t * Math.PI / 2);
        case 'InverseSine':
            return 1 - Math.sin((1 - t) * Math.PI / 2);
        case 'Back':
            let s = 1.70158;
            return t * t * ((s + 1) * t - s);
        case 'InverseBack':
            let s2 = 1.70158;
            t = 1 - t;
            return 1 - t * t * ((s2 + 1) * t - s2);
        case 'Elastic':
            let p = 0.3;
            return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
        case 'Bounce':
            if (t < (1 / 2.75)) {
                return 7.5625 * t * t;
            } else if (t < (2 / 2.75)) {
                t -= (1.5 / 2.75);
                return 7.5625 * t * t + 0.75;
            } else if (t < (2.5 / 2.75)) {
                t -= (2.25 / 2.75);
                return 7.5625 * t * t + 0.9375;
            } else {
                t -= (2.625 / 2.75);
                return 7.5625 * t * t + 0.984375;
            }
        case 'Smoothstep':
            return t * t * (3 - 2 * t);
        case 'InverseSmoothstep':
            return 1 - t * t * (3 - 2 * t);
        case 'Smootherstep':
            return t * t * t * (t * (t * 6 - 15) + 10);
        case 'InverseSmootherstep':
            return 1 - t * t * t * (t * (t * 6 - 15) + 10);
        case 'Circular':
            return 1 - Math.sqrt(1 - t * t);
        case 'InverseCircular':
            return Math.sqrt(1 - (1 - t) * (1 - t));
        default:
            return t; // Linear as default
    }
}


function formatColorCode(hexColor) {
    let r = parseInt(hexColor.slice(1, 3), 16) / 17;
    let g = parseInt(hexColor.slice(3, 5), 16) / 17;
    let b = parseInt(hexColor.slice(5, 7), 16) / 17;
    return includeEscapeCharacters ? `\\$${Math.floor(r).toString(16)}${Math.floor(g).toString(16)}${Math.floor(b).toString(16)}` : `$${Math.floor(r).toString(16)}${Math.floor(g).toString(16)}${Math.floor(b).toString(16)}`;
}

function colorizeString(inputString, type) {
    if (inputString.length < 2) return formatColorCode(startColorGlobal) + inputString;

    let colors = interpolateColors(inputString.length, type);
    let coloredString = "";
    let previewString = document.getElementById("previewString");
    previewString.innerHTML = "";

    for (let i = 0; i < inputString.length; i++) {
        let colorCode = formatColorCode(colors[i]);
        coloredString += `${colorCode}${inputString[i]}`;
        let span = document.createElement("span");
        span.style.color = colors[i];
        span.textContent = inputString[i];
        previewString.appendChild(span);
    }

    return coloredString;
}

function colorizeAndDisplay() {
    let inputString = document.getElementById("inputString").value;
    let type = document.querySelector('[name="interpolation"]:checked').value;
    if(inputString) {
        let outputString = colorizeString(inputString, type);
        document.getElementById("outputString").innerText = outputString;
    }
}

function updatePreview(previewContent) {
    document.getElementById("previewString").innerText = previewContent;
}

function toggleColorCard() {
    const modal = document.querySelector('.modal');
    const colorCard = document.getElementById('colorCard');

    isColorCardOpen = !isColorCardOpen;
    colorCard.classList.toggle('color-card-active');

    adjustModalPosition();
}

function toggleOptions() {
    const modal = document.querySelector('.modal');
    const optionsCard = document.getElementById('optionsCard');

    isOptionsCardOpen = !isOptionsCardOpen;
    optionsCard.classList.toggle('options-card-active');

    adjustModalPosition();
}

function adjustModalPosition() {
    const modal = document.querySelector('.modal');

    modal.classList.remove('modal-active', 'modal-options-active');

    if (isColorCardOpen && !isOptionsCardOpen) {
        modal.classList.add('modal-active');
    } else if (!isColorCardOpen && isOptionsCardOpen) {
        modal.classList.add('modal-options-active');
    }
}
