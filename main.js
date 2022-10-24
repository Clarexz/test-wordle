//Función para obtener la palabra de la API y crear el tablero
let arrWord = [];
const form = document.createElement("FORM");
async function getWord() {
    //Consulta a la api
    // API de AlexScigalszky const wordApi = 'https://palabras-aleatorias-public-api.herokuapp.com/random-by-length?length=5';
    const wordApi = "https://clientes.api.greenborn.com.ar/public-random-word?c=9&l=5"
    const result = await fetch(wordApi);
    const data = await result.json();
    //En esta variable se guarda la palabra que trae la api
    // palabra de la API de AlexScigalszkyconst word = data.body.Word.toUpperCase();
    word = data[0].toUpperCase();
    console.log(word);
    arrWord = word.split('');
    console.log(arrWord);
    
    //Crear formulario e insertarlo al html
    form.classList.add("col-rows");
    const div = document.querySelector("#game");
    div.appendChild(form);
    
    //for para crear las filas de los inputs
    for(let i = 0; i < 6; i++) {
        //for para crear los inputs de cada letra (columnas)
        for(let j = 0; j < arrWord.length; j++) {
            const input = document.createElement("INPUT");
            input.classList.add(`letter${i + 1}`);
            input.setAttribute("id", `letter${i + 1}-${j + 1}`);
            input.setAttribute("name", `letter${i + 1}-${j + 1}`);
            input.setAttribute("maxlength", "1");
            input.setAttribute("oninput", "this.value = this.value.toUpperCase()")
            input.style.marginLeft = ".5rem";
            input.style.height = "3rem";
            input.setAttribute("disabled", "true");
            form.appendChild(input);
        } 
    }

    //Linea para tener habilitada la escritura solo en la primera fila
    document.querySelectorAll(".letter1").forEach((input) => {input.disabled = false});
}
getWord();

//Objeto que guardará mas abajo el valor de cada input
let guessObj = {
    "letter1-1": "",
    "letter1-2": "",
    "letter1-3": "",
    "letter1-4": "",
    "letter1-5": ""
};

let rowCount = 1;
//Evento cada que se presiona una tecla
form.addEventListener("keypress", function(e) {
    //Cada variable guarda el valor del input en el objeto
    const input1 = document.querySelector(`#letter${rowCount}-1`);
    input1.addEventListener("input", function(e) {
        guessObj[e.target.id] = e.target.value;
        nextTab();
    });

    const input2 = document.querySelector(`#letter${rowCount}-2`);
    input2.addEventListener("input", function(e) {
        guessObj[e.target.id] = e.target.value;
        nextTab();
    });

    const input3 = document.querySelector(`#letter${rowCount}-3`);
    input3.addEventListener("input", function(e) {
        guessObj[e.target.id] = e.target.value;
        nextTab();
    });

    const input4 = document.querySelector(`#letter${rowCount}-4`);
    input4.addEventListener("input", function(e) {
        guessObj[e.target.id] = e.target.value;
        nextTab();
    });

    const input5 = document.querySelector(`#letter${rowCount}-5`);
    input5.addEventListener("input", function(e) {
        guessObj[e.target.id] = e.target.value;
    });

    
    if(e.key == "Enter") {
        //Al presionar Enter se guardan y unen los valores del objeto en el array
        arrGuess = Object.values(guessObj); 
        console.log(arrGuess);

        validate();
        gameOver();
    }
})

//Funcion para hacer autotab al siguiente input, el contador es para que después del 5to input ya no se haga autotab
let justOne = 0;
function nextTab() {
    if(justOne < 9) {
        if(document.querySelector(`#letter${rowCount}-1`).value.length == 1) {
            document.querySelector(`#letter${rowCount}-2`).focus();
        }
        if(document.querySelector(`#letter${rowCount}-2`).value.length == 1) {
            document.querySelector(`#letter${rowCount}-3`).focus();
        }
        if(document.querySelector(`#letter${rowCount}-3`).value.length == 1) {
            document.querySelector(`#letter${rowCount}-4`).focus();
        }
        if(document.querySelector(`#letter${rowCount}-4`).value.length == 1) {
            document.querySelector(`#letter${rowCount}-5`).focus();
        }
        justOne++;
    }
}

//Array que guardará en un solo value el valor de los inputs
let arrGuess = [];

//variable que almacena la palabra introducida para ver su length
let wordGuess;

//Función para validar si al dar enter introdujiste 5 letras o no
function validate() {
    wordGuess = arrGuess.join("")
    
    if(wordGuess.length == 5) {
        for(let i = 0; i < arrWord.length; i++) {
            if(arrGuess[i] == arrWord[i]) {
                document.querySelector(`#letter${rowCount}-${i + 1}`).classList.add("good");

                points++;
            } else if(arrGuess[i] != arrWord[i] && arrWord.indexOf(arrGuess[i]) >= 0 ) {
                document.querySelector(`#letter${rowCount}-${i + 1}`).classList.add("almost");
            } else if(arrGuess[i] != arrWord[i]) {
                document.querySelector(`#letter${rowCount}-${i + 1}`).classList.add("wrong");
            }
        }
    } else {
        return;
    }    
}

//Función para desabilitar la fila actual al dar Enter y habilitar la siguiente
function nextRow() {
    //Si la fila actual es alguna anterior a la 6
    if(rowCount < 6) {
        document.querySelectorAll(`.letter${rowCount}`).forEach((input) => {input.disabled = true});
    
        document.querySelectorAll(`.letter${rowCount + 1}`).forEach((input) => {input.disabled = false});
        
        rowCount++;

        //Reinicio de las variables
        justOne = 0;
        for(const value in guessObj) {
            delete guessObj[value];
        }
        arrGuess = [];
        points = 0;

        //Focus del siguiente input
        document.querySelector(`#letter${rowCount}-1`).focus()

    //Si la fila actual es la última
    } else if(rowCount == 6){
        document.querySelectorAll(`.letter${rowCount}`).forEach((input) => {input.disabled = true});
    
        document.querySelectorAll(`.letter${rowCount + 1}`).forEach((input) => {input.disabled = false});
        
        rowCount++;
    } else {
        return;
    }
}

//Los puntos se suman por cada clasa "good" activa en cada fila
let points = 0;

//Función para terminar el juego
function gameOver() {
    //Variables para crear el texto de victoria o derrota y el botón para reiniciar
    let divFinal = document.querySelector("#final");
    let h2Final = document.createElement("H2");
    let btnFinal = document.createElement("BUTTON");
    btnFinal.textContent = "Jugar otra vez";
    btnFinal.setAttribute("onClick", "window.location.reload()");

    //Si la fila actual es la última y no se consiguen los 5 puntos
    if(rowCount == 6 && points != 5) {
        h2Final.textContent = "Perdiste :("
        divFinal.appendChild(h2Final);
        divFinal.appendChild(btnFinal);
    }

    //Si en la fila, sea cual sea, consigues los 5 puntos
    if(points == 5) {
        document.querySelectorAll(`.letter${rowCount}`).forEach((input) => {input.disabled = true});
        
        h2Final.textContent = "¡Ganaste!"
        divFinal.appendChild(h2Final);
        divFinal.appendChild(btnFinal);

    //Si no estás en la última fila y además no estás consiguiendo los 5 puntos
    } else {
        nextRow();
    }
}