
var table = document.getElementById('results');

// Appends a row to the log.
// timestamp, resultIndex, final, alternativeIndex, confidence, transcript
function logResultRow(speechRecognitionResult, resultIndex){

  for(var i = 0; i < speechRecognitionResult.length; i++){
    var alternative = speechRecognitionResult[i];
    var values = [
      (+new Date) - recognitionStartTimeMs,
      resultIndex,
      speechRecognitionResult.final,
      i,
      alternative.confidence,
      alternative.transcript
    ];

    var tr = document.createElement('tr');
    for (var j = 0; j < values.length; j++){
      var value = values[j];
      var td = document.createElement('td');
      td.innerText = value;
      tr.appendChild(td);
    }
    table.insertBefore(tr, table.firstChild);
  }
}


var recognitionStartTimeMs;
function onStart(){
  recognitionStartTimeMs = +new Date;
  recognition.start();
}


function onResult(event){
  var result = event.results[event.resultIndex];
  logResultRow(result, event.resultIndex);
}


function onError(event){
  var tr = document.createElement('tr');
  tr.className = 'error';
  var td = document.createElement('td');
  td.innerText = (+new Date) - recognitionStartTimeMs;
  tr.appendChild(td);
  var td = document.createElement('td');
  td.innerHTML = 'SpeechRecognitionError: <b>' + event.error + '</b>';
  td.setAttribute('colspan', 5);
  tr.appendChild(td);
  table.insertBefore(tr, table.firstChild);
}


function onStop(){
  recognition.stop();
}


var recognition = new window.webkitSpeechRecognition();

recognition.onresult = onResult;
recognition.onerror = onError;
recognition.continuous = true;
recognition.interimResults = true;

// Allow the user to set the number of alternatives returned.
var maxAlternatives = document.getElementById("max-alternatives");
maxAlternatives.onchange = function(){
  recognition.maxAlternatives = parseInt(this.value);
}
recognition.maxAlternatives = maxAlternatives.value;


document.getElementById('start').onclick = onStart;
document.getElementById('stop').onclick = onStop;


// For testing.
function getFakeSpeechRecognitionEvent(){

  function getResult(){
    var r = [];
    r['final'] = (Math.random() < 0.5);
    r[0] = {
      confidence: Math.random(),
      transcript: 'Hello, world!'
    },
    r[1] = {
      confidence: Math.random(),
      transcript: 'Hello, world!'
    }
    return r;
  }

  var results = [
    getResult(),
  ];
  
  var event = {
    results: results,
    resultIndex: 0
  } 
  return event;
}

function getFakeSpeechRecognitionError(){
  var errorCodes = [
    "no-speech",
    "aborted",
    "audio-capture",
    "network",
    "not-allowed",
    "service-not-allowed",
    "bad-grammar",
    "language-not-supported"
  ];
  return {
    error: errorCodes[Math.floor(Math.random() * errorCodes.length)]
  }
}

// Generates bogus results.
function test(){
  recognitionStartTimeMs = +new Date;
  setInterval(function(){

    if (Math.random() < 0.8){
      onResult(getFakeSpeechRecognitionEvent());
    } else {
      onError(getFakeSpeechRecognitionError());
    }
  }, 250);
}

