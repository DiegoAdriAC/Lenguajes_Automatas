function mostrarDivs() {
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

    // Obtén los elementos div por su ID
    var divPrefija = document.getElementById("divPrefija");
    var divPosfija = document.getElementById("divPosfija");
    var divResultado = document.getElementById("divResultado");

    // Cambia la propiedad de estilo display para mostrar los div
    divPrefija.style.display = "block";
    divPosfija.style.display = "block";
    divResultado.style.display = "block";
}

function convertirAPrefija(expresionInfija) {
    // Conversión a notación prefija aquí
    // Puedes utilizar pilas (stacks) para ayudarte en la conversión

    return "Prefija";
}

function convertirAPostfija(expresionInfija) {
    // Conversión a notación postfija aquí

    return "Postfija";
}

function resolverExpresion() {
    // Resolver la expresion para que me de un resultado

    return 123;
}