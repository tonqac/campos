var json_all;
var campos = [];
var zonas = [];

var arr_guetos = new Array();
var arr_names = new Array();
var arr_countries = new Array();

function initProject() {
    $(document).on('click', '[data-toggle="lightbox"]', function (event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });

    var curDown = false,
        curYPos = 0,
        curXPos = 0,
        listaCampos = false,
        listaZonas = false;

    $(window).mousemove(function (m) {
        if (curDown === true) {
            if (listaCampos === true) {
                $("#campos").scrollTop($("#campos").scrollTop() + (curYPos - m.pageY) / 5);
                $("#campos").scrollLeft($("#campos").scrollLeft() + (curXPos - m.pageX) / 5);
            } else if (listaZonas === true) {
                $("#zonas").scrollTop($("#zonas").scrollTop() + (curYPos - m.pageY) / 5);
                $("#zonas").scrollLeft($("#zonas").scrollLeft() + (curXPos - m.pageX) / 5);
            }
        }
    });

    $(".lista-buscar").mousedown(function (m) {
        curDown = true;
        curYPos = m.pageY;
        curXPos = m.pageX;
    });

    $(".lista-buscar").mouseup(function () {
        curDown = false;
        listaGuetos = false;
        listaZonas = false;
        listaCampos = false;
    });

    $("#zonas").mousedown(function (m) {
        listaZonas = true;
    });

    $("#campos").mousedown(function (m) {
        listaCampos = true;
    });

    $("#no_results").click(function () {
        $(this).fadeOut();
    });

    $("#campos").on("click", ".btn", function () {
        $(this).toggleClass("seleccionado");

        campos = [];
        $("#campos .btn.seleccionado").each(function(){
            var id_tipo = $(this).attr("data-val");
            campos.push(id_tipo);
        })

        setMarkers();
    });

    $("#zonas").on("click", "button", function () {
        $(this).toggleClass("seleccionado");

        zonas = [];
        $("#zonas .btn.seleccionado").each(function(){
            var id_tipo = parseInt($(this).attr("data-val"));
            zonas.push(id_tipo);
        })

        setMarkers();
    });

    $("#stats").on("click","button", function(){
        $(this).ekkoLightbox();
    });
    

    setMarkers();
};

function loadProject() {
    var min_anio = 9999;
    var max_anio = 0;

    // Leo el json y ya lo guardo en memoria
    $.getJSON("json/database.json?_=" + new Date().getTime(), function (json) {
        json_all = json;
        initProject();
    });
}

function initActualizador() {
    // Muestro el loading y la barra animada mientras se ejecuta el ajax
    var cant = 0;
    var timer = setInterval(function () {
        cant++;
        porcentaje = cant * 100 / 120;
        $("#loading_bars span").css("width", porcentaje + "%");
    }, 500);

    $.get("ajax/actualizador.php", function (data) {
        // Una vez que terminó la ejecución, inicio el proyecto
        loadProject();

        clearInterval(timer);
        $("#loading_bars span").css("width", "100%");
        $("#loading_principal").fadeOut(300);
    });
}

$(initActualizador);

function getResultsFromFilters() {
    // Busco todos los items filtrados según los checks
    var results = [];

    json_all.forEach(function (item){
        if($.inArray(item["id_tipo"],campos)>-1) results.push(item);
    });

    //console.log(results);
    return results;
}

function decodeEntities(input) {
    input = input.replace(/<\/?[^>]+(>|$)/g, "");
    var y = document.createElement('textarea');
    y.innerHTML = input;
    return y.value;
}





/* -- PULIDO -- */

//aca dejo un audio para testeo...

var closeAudio = new Audio('audio/close.mp3');
var openAudio = new Audio('audio/open.mp3');
var changeAudio = new Audio('audio/change.mp3');

var arraySonidos = [closeAudio, changeAudio, openAudio];


// Debug Mode

var debugMode;

var isIddle = false;

var inactivityTimeInMillis = 3 * 1000 * 60;

var timeoutId;

var datGUI, stats

var audioMuted;

// Current Time

var pantallaBloqueada = false;
var currentHour;
var currentMinute;
var endIddle;

// Variables reactivar post CIERRE

var countClicks = 0;
var counterSegundos = 5;
var maxClicksCierre = 10;

var horaCierre;
var minutosCierre;

var tiempoIntervalCierre = 1000 * 60 * 5;
var intervalCierre; //ESTE ES EL INTERVAL QUE CHECKEA CADA CIERTO TIEMPO (tiempoIntervalCierre) SI ES EL HORARIO DE CIERRE



var addListeners = function () {

    $(".logo-museo").click(function () {

        if (countClicks == 0) {
            TweenMax.delayedCall(counterSegundos, contadorClicks);

            function contadorClicks() {
                countClicks = 0;
                console.log("reseteo contador");
            }

        }

        if (countClicks >= maxClicksCierre) {
            $('.iddle').css('display', 'none');
            clearInterval(intervalCierre);
        }

        countClicks++;
        console.log("cantclicks: " + countClicks);
    });

    document.addEventListener("touchstart", touchHandler, { passive: false });

    $(window).keydown(function (e) {

        if (e.keyCode == "32") {
            // ESPACIO
            location.reload();
        }

        if (e.keyCode == "77") {
            // TECLA M
            if ($("body").hasClass("nocursor")) {
                $("body").removeClass("nocursor");
                $("body").css("cursor", "auto");
            } else {
                $("body").addClass("nocursor");
                $("body").css("cursor", "none");
            }
        }

        if (e.keyCode == "68") {
            // TECLA D
            if ($(".guiContainer").hasClass("oculto")) {
                $(".guiContainer").removeClass("oculto");
            } else {
                $(".guiContainer").addClass("oculto");
            }
        }

        if (e.keyCode == "48" || e.keyCode == "96") {
            // TECLA 0
            if (localStorage.content == undefined || localStorage.content == 1) {
                localStorage.content = 0;
                console.log("se apreto 0");
                location.reload();
            }
        }

        if (e.keyCode == "49" || e.keyCode == "97") {
            // TECLA 1
            if (localStorage.content == undefined || localStorage.content == 0) {
                localStorage.content = 1;
                console.log("se apreto 1");
                location.reload();
            }
        }

    });

    $('input[name="tabs"]').click(function () {
        changeAudio.play();
    });

}

//**
// Checkeo si no es la hora de cierre
//**

var checkeoHora = function () {

    intervalCierre = window.setInterval(function () {
        var now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
        currentHour = now.getHours();
        currentMinute = now.getMinutes();
        if (currentHour >= horaCierre + 1 || currentHour >= horaCierre && currentMinute >= minutosCierre) {

            $(".iddle").addClass("por-cerrar");
            pantallaBloqueada = true;
            setIdleMode();

        }
    }, tiempoIntervalCierre);
}



var touchHandler = function (event) {

    if (event.touches.length > 1) {
        //the event is multi-touch
        //you can then prevent the behavior
        event.preventDefault()
    }
}

/**
   * ...
   * addStats();
   * agrega las stats al dom...ver de togglearlas con keyboard
   * para acceder u ocultar segun corresponda...
   */

var addStats = function () {

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '30px';
    stats.domElement.style.top = '0px';
    $("body").append(stats.domElement);
}


var loadData = function (debugMode) {
    console.log(debugMode);
    //addDatGUI();
    if (debugMode == 1) addStats();
    if (debugMode == 0 || debugMode == undefined) $('body').addClass('nocursor');
    if (debugMode == 0 || debugMode == undefined) $("*").on("contextmenu", function () { return false; });
    checkeoHora();
    addListeners();
}



$.getJSON("json/data.json", function (data) {
    $("#iddleTittle").html(data.tituloIddle);
    $("#iddleBajada").html(data.bajadaIddle);
    $(".texto-adios h3").html(data.tituloCierre);
    $(".texto-adios span").html(data.bajadaCierre);
});

console.log("local: " + localStorage.content);

if (localStorage.getItem("content") != null) {
    console.log("content es distinto a null y su valor es:" + localStorage.getItem("content"));

    if (localStorage.content == 0) {
        debugMode = 0;
    } else {
        debugMode = 1;
    }
    loadData(debugMode);
    localStorage.removeItem("content");
} else {
    $.getJSON("json/data.json", function (data) {
        debugMode = data.debug;
        loadData(debugMode);
        horaCierre = data.horaCierre;
        minutosCierre = data.minutosCierre;
    });
}

$.getJSON("json/data.json", function (data) {
    horaCierre = data.horaCierre;
    minutosCierre = data.minutosCierre;
});