/* =====================================================
   JANTA SWARAS PRACTICE

   COMPLETE SCRIPT.JS

   FINAL FIX VERSION

   Tala:
   - Constant 60 BPM
   - 1 beat = 1 second

   Swara Highlight:
   - 1st Speed = 1 swara / beat
   - 2nd Speed = 2 swaras / beat
   - 3rd Speed = 4 swaras / beat

===================================================== */



/* =====================================================
   ELEMENTS
===================================================== */


const notationDiv =
document.getElementById("notation");


const previewNotation =
document.getElementById("previewNotation");


const lessonSelect =
document.getElementById("lessonSelect");


const speedSelect =
document.getElementById("speedSelect");


const playBtn =
document.getElementById("playBtn");


const restartBtn =
document.getElementById("restartBtn");


const audioPlayer =
document.getElementById("audioPlayer");


const progressBar =
document.getElementById("progressBar");


const beats =
document.querySelectorAll(".beat");




/* =====================================================
   VARIABLES
===================================================== */


let currentLesson = 1;


let currentSpeed = 1;



let aarohanamBlocks = [];


let avarohanamBlocks = [];



let currentIndex = -1;


let currentBeat = -1;



/*
    Fixed Tala BPM

    Never changes with speed

*/

const TALA_BPM = 60;


const TALA_BEAT_TIME =
60 / TALA_BPM;



/*
    Swara timing changes
    according to Carnatic speed

*/

let swaraTime = 1;





/* =====================================================
   JANTA DATA
===================================================== */


const lessons = {


1:{


notation:[


["S","S","R","R","G","G","M","M"],

["P","P","D","D","N","N","S′","S′"],

["S′","S′","N","N","D","D","P","P"],

["M","M","G","G","R","R","S","S"]


],



audio:{


1:"audios/Janta1_speed1.mp3",

2:"audios/Janta1_speed2.mp3",

3:"audios/Janta1_speed3.mp3"


}


},




2:{


notation:[


["S","S","R","R","G","G","M","M"],

["R","R","G","G","M","M","P","P"],

["G","G","M","M","P","P","D","D"],

["M","M","P","P","D","D","N","N"],

["P","P","D","D","N","N","S′","S′"],


["S′","S′","N","N","D","D","P","P"],

["N","N","D","D","P","P","M","M"],

["D","D","P","P","M","M","G","G"],

["P","P","M","M","G","G","R","R"],

["M","M","G","G","R","R","S","S"]


],



audio:{


1:"audios/Janta2_speed1.mp3",

2:"audios/Janta2_speed2.mp3",

3:"audios/Janta2_speed3.mp3"


}


},




3:{


notation:[


["S","S","R","R","G","G","R","R"],

["S","S","R","R","G","G","M","M"],


["R","R","G","G","M","M","G","G"],

["R","R","G","G","M","M","P","P"],


["G","G","M","M","P","P","M","M"],

["G","G","M","M","P","P","D","D"],


["M","M","P","P","D","D","P","P"],

["M","M","P","P","D","D","N","N"],


["P","P","D","D","N","N","D","D"],

["P","P","D","D","N","N","S′","S′"],


["S′","S′","N","N","D","D","N","N"],

["S′","S′","N","N","D","D","P","P"],


["N","N","D","D","P","P","D","D"],

["N","N","D","D","P","P","M","M"],


["D","D","P","P","M","M","P","P"],

["D","D","P","P","M","M","G","G"],


["P","P","M","M","G","G","M","M"],

["P","P","M","M","G","G","R","R"],


["M","M","G","G","R","R","G","G"],

["M","M","G","G","R","R","S","S"]


],



audio:{


1:"audios/Janta3_speed1.mp3",

2:"audios/Janta3_speed2.mp3",

3:"audios/Janta3_speed3.mp3"


}


},



/* PART 2 CONTINUES WITH JANTA 4,5,6 DATA */

/* ===============================
   JANTA 4
================================ */


4:{


notation:[


["S","S","R","R","G","S","R","G"],

["S","S","R","R","G","G","M","M"],


["R","R","G","G","M","R","G","M"],

["R","R","G","G","M","M","P","P"],


["G","G","M","M","P","G","M","P"],

["G","G","M","M","P","P","D","D"],


["M","M","P","P","D","M","P","D"],

["M","M","P","P","D","D","N","N"],


["P","P","D","D","N","P","D","N"],

["P","P","D","D","N","N","S′","S′"],



["S′","S′","N","N","D","S′","N","D"],

["S′","S′","N","N","D","D","P","P"],


["N","N","D","D","P","N","D","P"],

["N","N","D","D","P","P","M","M"],


["D","D","P","P","M","D","P","M"],

["D","D","P","P","M","M","G","G"],


["P","P","M","M","G","P","M","G"],

["P","P","M","M","G","G","R","R"],


["M","M","G","G","R","M","G","R"],

["M","M","G","G","R","R","S","S"]


],



audio:{


1:"audios/Janta4_speed1.mp3",

2:"audios/Janta4_speed2.mp3",

3:"audios/Janta4_speed3.mp3"


}


},





/* ===============================
   JANTA 5
================================ */


5:{


notation:[


["S","S","R","S","S","R","S","R"],

["S","S","R","R","G","G","M","M"],


["R","R","G","R","R","G","R","G"],

["R","R","G","G","M","M","P","P"],


["G","G","M","G","G","M","G","M"],

["G","G","M","M","P","P","D","D"],


["M","M","P","M","M","P","M","P"],

["M","M","P","P","D","D","N","N"],


["P","P","D","P","P","D","P","D"],

["P","P","D","D","N","N","S′","S′"],



["S′","S′","N","S′","S′","N","S′","N"],

["S′","S′","N","N","D","D","P","P"],


["N","N","D","N","N","D","N","D"],

["N","N","D","D","P","P","M","M"],


["D","D","P","D","D","P","D","P"],

["D","D","P","P","M","M","G","G"],


["P","P","M","P","P","M","P","M"],

["P","P","M","M","G","G","R","R"],


["M","M","G","M","M","G","M","G"],

["M","M","G","G","R","R","S","S"]


],



audio:{


1:"audios/Janta5_speed1.mp3",

2:"audios/Janta5_speed2.mp3",

3:"audios/Janta5_speed3.mp3"


}


},





/* ===============================
   JANTA 6
================================ */


6:{


notation:[


["S","S","S","R","R","R","G","G"],

["S","S","R","R","G","G","M","M"],


["R","R","R","G","G","G","M","M"],

["R","R","G","G","M","M","P","P"],


["G","G","G","M","M","M","P","P"],

["G","G","M","M","P","P","D","D"],


["M","M","M","P","P","P","D","D"],

["M","M","P","P","D","D","N","N"],


["P","P","P","D","D","D","N","N"],

["P","P","D","D","N","N","S′","S′"],



["S′","S′","S′","N","N","N","D","D"],

["S′","S′","N","N","D","D","P","P"],


["N","N","N","D","D","D","P","P"],

["N","N","D","D","P","P","M","M"],


["D","D","D","P","P","P","M","M"],

["D","D","P","P","M","M","G","G"],


["P","P","P","M","M","M","G","G"],

["P","P","M","M","G","G","R","R"],


["M","M","M","G","G","G","R","R"],

["M","M","G","G","R","R","S","S"]


],



audio:{


1:"audios/Janta6_speed1.mp3",

2:"audios/Janta6_speed2.mp3",

3:"audios/Janta6_speed3.mp3"


}


}



};

/* =====================================================
   DISPLAY ENGINE
===================================================== */



/* ===============================
   SWARA COLOUR CLASS
================================ */


function getSwaraClass(note){


    if(note.includes("S"))
        return "s-note";


    if(note.includes("R"))
        return "r-note";


    if(note.includes("G"))
        return "g-note";


    if(note.includes("M"))
        return "m-note";


    if(note.includes("P"))
        return "p-note";


    if(note.includes("D"))
        return "d-note";


    if(note.includes("N"))
        return "n-note";


    return "";

}







/* ===============================
   CREATE SWARA NOTATION
================================ */


function createNotation(container, rows){



    container.innerHTML = "";



    let blocks = [];





    rows.forEach(row=>{



        let rowDiv =
        document.createElement("div");



        rowDiv.className =
        "swara-row";





        row.forEach(note=>{



            let span =
            document.createElement("span");



            span.className =
            "swara";



            span.textContent =
            note;



            span.classList.add(

                getSwaraClass(note)

            );



            rowDiv.appendChild(span);



            blocks.push(span);



        });




        container.appendChild(rowDiv);



    });





    return blocks;



}








/* ===============================
   LOAD LESSON DISPLAY

   Janta 1 & 2:
   Single large panel

   Janta 3-6:
   35 : 35 split

================================ */


function loadLesson(){



    document.body.classList.remove(
        "simple-view"
    );



    aarohanamBlocks = [];

    avarohanamBlocks = [];





    let rows =

    lessons[currentLesson]
    .notation;





    if(currentLesson <= 2){



        document.body.classList.add(
            "simple-view"
        );



        aarohanamBlocks =

        createNotation(

            notationDiv,

            rows

        );



        previewNotation.innerHTML =
        "";



    }



    else{



        let split =

        Math.ceil(
            rows.length / 2
        );




        let aarohanamRows =

        rows.slice(
            0,
            split
        );



        let avarohanamRows =

        rows.slice(
            split
        );





        aarohanamBlocks =

        createNotation(

            notationDiv,

            aarohanamRows

        );





        avarohanamBlocks =

        createNotation(

            previewNotation,

            avarohanamRows

        );



    }



    loadAudio();


    reset();



}

/* =====================================================
   AUDIO MANAGEMENT
===================================================== */



/* ===============================
   LOAD AUDIO
================================ */


function loadAudio(){



    audioPlayer.src =

    lessons[currentLesson]
    .audio[currentSpeed];



    audioPlayer.load();



}








/* ===============================
   SET SWARA TIMING

   Carnatic Speed Theory:

   1st Speed:
   1 swara = 1 beat

   2nd Speed:
   2 swaras = 1 beat

   3rd Speed:
   4 swaras = 1 beat

================================ */


function setSwaraTiming(){



    if(currentSpeed === 1){


        swaraTime = 1;


    }



    else if(currentSpeed === 2){


        swaraTime = 0.5;


    }



    else{


        swaraTime = 0.25;


    }



}








/* ===============================
   RESET PRACTICE
================================ */


function reset(){



    [
        ...aarohanamBlocks,
        ...avarohanamBlocks

    ]

    .forEach(block=>{



        block.classList.remove(
            "active"
        );



    });






    beats.forEach(beat=>{



        beat.classList.remove(
            "active"
        );



    });






    currentIndex = -1;



    currentBeat = -1;



    progressBar.style.width =
    "0%";



}








/* ===============================
   AUDIO READY

   Recalculate timing when
   speed changes

================================ */


audioPlayer.addEventListener(

"loadedmetadata",

function(){


    setSwaraTiming();


}

);

/* =====================================================
   SWARA HIGHLIGHT ENGINE

   Carnatic Speed Rules:

   1st Speed:
   S  S  R  R  G  G  M  M
   Each swara = 1 beat

   2nd Speed:
   SS RR GG MM
   Two swaras = 1 beat

   3rd Speed:
   SSRR GGMM
   Four swaras = 1 beat

===================================================== */





function updateHighlight(){



    if(audioPlayer.paused)
        return;




    let index =



    Math.floor(

        audioPlayer.currentTime /

        swaraTime

    );






    if(index === currentIndex)
        return;






    [
        ...aarohanamBlocks,
        ...avarohanamBlocks

    ]

    .forEach(block=>{


        block.classList.remove(
            "active"
        );


    });








    if(index < aarohanamBlocks.length){



        aarohanamBlocks[index]

        ?.classList.add(

            "active"

        );



    }




    else{



        let avarohanamIndex =

        index -

        aarohanamBlocks.length;




        avarohanamBlocks[avarohanamIndex]

        ?.classList.add(

            "active"

        );



    }






    currentIndex = index;



}

/* =====================================================
   TALA ENGINE

   Fixed:
   60 BPM

   1 beat = 1 second

   Tala does NOT change with speed

===================================================== */





function updateTala(){



    let beatIndex =



    Math.floor(

        audioPlayer.currentTime /

        TALA_BEAT_TIME

    )

    % 8;






    if(beatIndex === currentBeat)
        return;







    beats.forEach(beat=>{



        beat.classList.remove(
            "active"
        );



    });








    beats[beatIndex]

    ?.classList.add(

        "active"

    );







    currentBeat = beatIndex;



}








/* =====================================================
   ANIMATION LOOP
===================================================== */





function animate(){



    if(!audioPlayer.paused){






        updateHighlight();





        updateTala();








        if(audioPlayer.duration){



            progressBar.style.width =



            (

            audioPlayer.currentTime /

            audioPlayer.duration *

            100

            )

            + "%";



        }








        requestAnimationFrame(

            animate

        );



    }



}

/* =====================================================
   CONTROLS
===================================================== */





/* ===============================
   PLAY / PAUSE
================================ */


playBtn.onclick = function(){



    if(audioPlayer.paused){



        audioPlayer.play();




        playBtn.textContent =

        "⏸ Pause";





        animate();



    }



    else{



        audioPlayer.pause();




        playBtn.textContent =

        "▶ Play";



    }



};








/* ===============================
   RESTART
================================ */


restartBtn.onclick = function(){



    audioPlayer.pause();



    audioPlayer.currentTime = 0;



    reset();



    playBtn.textContent =

    "▶ Play";



};








/* ===============================
   SELECT JANTA
================================ */


lessonSelect.onchange = function(){



    currentLesson =

    Number(

        this.value

    );




    loadLesson();



};








/* ===============================
   SELECT SPEED
================================ */


speedSelect.onchange = function(){



    currentSpeed =

    Number(

        this.value

    );




    setSwaraTiming();




    loadAudio();




    reset();



};








/* ===============================
   AUDIO END
================================ */


audioPlayer.addEventListener(

"ended",

function(){



    playBtn.textContent =

    "▶ Play";



    reset();



}

);

/* =====================================================
   FINAL INITIALIZATION
===================================================== */



/* ===============================
   INITIAL SPEED SETUP
================================ */


setSwaraTiming();





/* ===============================
   LOAD FIRST LESSON
================================ */


loadLesson();





/* ===============================
   KEEP PLAY BUTTON CORRECT
================================ */


audioPlayer.addEventListener(

"pause",

function(){


    if(audioPlayer.currentTime !== 0){


        playBtn.textContent =

        "▶ Play";


    }


}

);





/* ===============================
   START COMPLETE
================================ */