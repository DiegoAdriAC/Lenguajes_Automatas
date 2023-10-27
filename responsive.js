function limpiar(){
    document.getElementById('expresion').value = '';
    document.getElementById('prefija').value = '';
    document.getElementById('postfija').value = '';
    document.getElementById('resultado').value = '';

    document.getElementById('divPrefija').style.display = 'none';
    document.getElementById('divPosfija').style.display = 'none';
    document.getElementById('divResultado').style.display = 'none';
}

function mostrarDivs() {
    if(document.getElementById("expresion").value == ''){
        return ;
    }

    // Obtén la expresión en notación infija desde el input
    var infija = document.getElementById("expresion").value;
    
    try {
        const prefija = convertirAPrefija(infija);
        const postfija = convertirAPostfija(infija);
        const resultado = resolverExpresion(infija);

        // Muestra las expresiones convertidas en los inputs correspondientes
        document.getElementById("prefija").value = prefija;
        document.getElementById("postfija").value = postfija;
        document.getElementById("resultado").value = resultado;
    } catch (error) {
        alert("Hubo un error al procesar la expresión.");
    }

    // Oculta los divs
    document.getElementById("divPrefija").style.display = "block";
    document.getElementById("divPosfija").style.display = "block";
    document.getElementById("divResultado").style.display = "block";

}

function convertirAPrefija(expression) {
    // Función para el valor operadores
    function getValorOperador(operator) {
        if (operator === '^') return 3;
        if (operator === '*' || operator === '/') return 2;
        if (operator === '+' || operator === '-') return 1;
        return 0;
    }

    // Función para revisa si un carácter es un operador
    function esOperador(char) {
        return "+-*/^".includes(char);
    }

    // Función para invertir una cadena
    function revertirCadena(str) {
        return str.split("").reverse().join("");
    }

    // Convierte la expresión infija a un array de caracteres
    expression = revertirCadena(expression);
    let infija = expression.split("");
    let pila = [];
    let prefija = [];

    for (let i = 0; i < infija.length; i++) {
        if (esOperador(infija[i])) {
            while (
                pila.length > 0 &&
                getValorOperador(pila[pila.length - 1]) >= getValorOperador(infija[i])
            ) {
                prefija.push(pila.pop());
            }
            pila.push(infija[i]);
        } else if (infija[i] === ')') {
            pila.push(infija[i]);
        } else if (infija[i] === '(') {
            while (pila.length > 0 && pila[pila.length - 1] !== ')') {
                prefija.push(pila.pop());
            }
            pila.pop(); // Deshacerse del paréntesis izquierdo
        } else {
            // Es un operando, agregarlo a la salida
            prefija.push(infija[i]);
        }
    }

    while (pila.length > 0) {
        prefija.push(pila.pop());
    }

    // Invertir la salida para obtener la notación prefija
    return revertirCadena(prefija.join(""));

}

function convertirAPostfija(expression) {
    // Función para determinar la precedencia de los operadores
    function getValorOperador(operator) {
        if (operator === '^') return 3;
        if (operator === '*' || operator === '/') return 2;
        if (operator === '+' || operator === '-') return 1;
        return 0;
    }

    // Función para verificar si un carácter es un operador
    function esOperador(char) {
        return "+-*/^".includes(char);
    }

    let pila = [];
    let posfija = [];

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if (char === ' ') {
            continue; // Ignorar espacios en blanco
        }

        if (!esOperador(char) && char !== '(' && char !== ')') {
            posfija.push(char); // Si es un operando, agregarlo a la salida
        } else if (esOperador(char)) {
            while (
                pila.length > 0 &&
                pila[pila.length - 1] !== '(' &&
                getValorOperador(pila[pila.length - 1]) >= getValorOperador(char)
            ) {
                posfija.push(pila.pop());
            }
            pila.push(char);
        } else if (char === '(') {
            pila.push(char);
        } else if (char === ')') {
            while (pila.length > 0 && pila[pila.length - 1] !== '(') {
                posfija.push(pila.pop());
            }
            pila.pop(); // Deshacerse del paréntesis izquierdo
        }
    }

    while (pila.length > 0) {
        posfija.push(pila.pop());
    }

    // Unir la salida para obtener la notación postfija
    return posfija.join("");

}

function resolverExpresion(expression) {
    // Función para determinar la precedencia de los operadores
    function getPrecedence(operator) {
        if (operator === '^') return 3;
        if (operator === '*' || operator === '/') return 2;
        if (operator === '+' || operator === '-') return 1;
        return 0;
    }

    // Función para calcular el resultado de una operación
    function applyOperator(operand1, operand2, operator) {
        switch (operator) {
            case '+':
                return operand1 + operand2;
            case '-':
                return operand1 - operand2;
            case '*':
                return operand1 * operand2;
            case '/':
                if (operand2 === 0) {
                    throw new Error('División por cero no está permitida.');
                }
                return operand1 / operand2;
            case '^':
                return Math.pow(operand1, operand2);
            default:
                throw new Error('Operador no válido: ' + operator);
        }
    }

    let stackOperators = [];
    let stackOperands = [];

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if (char === ' ') {
            continue; // Ignorar espacios en blanco
        }

        if (!isNaN(parseFloat(char))) {
            let operand = '';
            while (i < expression.length && !isNaN(parseFloat(expression[i]))) {
                operand += expression[i];
                i++;
            }
            i--;
            stackOperands.push(parseFloat(operand));
        } else if (char === '(') {
            stackOperators.push(char);
        } else if (char === ')') {
            while (stackOperators.length > 0 && stackOperators[stackOperators.length - 1] !== '(') {
                let operator = stackOperators.pop();
                let operand2 = stackOperands.pop();
                let operand1 = stackOperands.pop();
                stackOperands.push(applyOperator(operand1, operand2, operator));
            }
            stackOperators.pop(); // Deshacerse del paréntesis izquierdo
        } else if ('+-*/^'.includes(char)) {
            while (
                stackOperators.length > 0 &&
                getPrecedence(stackOperators[stackOperators.length - 1]) >= getPrecedence(char)
            ) {
                let operator = stackOperators.pop();
                let operand2 = stackOperands.pop();
                let operand1 = stackOperands.pop();
                stackOperands.push(applyOperator(operand1, operand2, operator));
            }
            stackOperators.push(char);
        }
    }

    while (stackOperators.length > 0) {
        let operator = stackOperators.pop();
        let operand2 = stackOperands.pop();
        let operand1 = stackOperands.pop();
        stackOperands.push(applyOperator(operand1, operand2, operator));
    }

    if (stackOperands.length !== 1 || stackOperators.length > 0) {
        throw new Error('Expresión infija no válida.');
    }

    return stackOperands[0];
}
