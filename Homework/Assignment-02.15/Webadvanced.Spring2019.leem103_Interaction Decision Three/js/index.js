window.onload = function () {
  
  var questionArea = document.getElementsByClassName('questions')[0],
      answerArea   = document.getElementsByClassName('answers')[0],
      checker      = document.getElementsByClassName('checker')[0],
      current      = 0,
  
     // An object that holds all the questions + possible answers.
     // In the array --> last digit gives the right answer position
      allQuestions = {
        'Do you have assignment?' : ['Yes','No',0],
        
        'Do your best!' : ['Yes','No', 0],
        
        'Do you finishi it?' : ['Yes','No', 0],

        'Do you meet some trouble?' : ['Yes','No', 0],

        'Do you give up?' : ['Yes','No', 1],

        'Is this group assignment?' : ['Yes','No', 0],

        'Congratulation do whatever you want' : ['Yes']
      };
      
  function loadQuestion(curr) {
  // This function loads all the question into the questionArea
  // It grabs the current question based on the 'current'-variable
  
    var question = Object.keys(allQuestions)[curr];

    console.log(curr);

    if (curr == 1){
      console.log("change");
      
    }
    
    questionArea.innerHTML = '';
    questionArea.innerHTML = question;    
  }


  
  function loadAnswers(curr) {
  // This function loads all the possible answers of the given question
  // It grabs the needed answer-array with the help of the current-variable
  // Every answer is added with an 'onclick'-function
  
    var answers = allQuestions[Object.keys(allQuestions)[curr]];
    
    answerArea.innerHTML = '';
    
    for (var i = 0; i < answers.length -1; i += 1) {
      var createDiv = document.createElement('div'),
          text = document.createTextNode(answers[i]);
      
      createDiv.appendChild(text);      
      createDiv.addEventListener("click", checkAnswer(i, answers));
      
      
      answerArea.appendChild(createDiv);
    }
  }
  
  function checkAnswer(i, arr) {
    // This is the function that will run, when clicked on one of the answers
    // Check if givenAnswer is sams as the correct one
    // After this, check if it's the last question:
    // If it is: empty the answerArea and let them know it's done.
    
    return function () {
      var givenAnswer = i,
          correctAnswer = arr[arr.length-1];
      
      // if (givenAnswer === correctAnswer) {
      //   addChecker(true);            
      // }
      // else {
      //   addChecker(false);                    
      // }
      
      if (givenAnswer == correctAnswer) {

        //turn true
          addChecker(true);

        //once is true, what should I do?   
          current += 1;
          loadQuestion(current);
          loadAnswers(current);

          console.log(correctAnswer);
      }
      
      else {
          addChecker(false);
          questionArea.innerHTML = 'Congratulation do whatever you want!';
          answerArea.innerHTML = '';
          console.log('this is no');


          var yesno = document.getElementById("yesno");
          yesno.classList.add("hide");
      }
      

  
      // if (current <= Object.keys(allQuestions).length -1) {
      //   current += 1;
        
      //   loadQuestion(current);
      //   loadAnswers(current);
      // } else {
      //   questionArea.innerHTML = 'Congratulation do whatever you want!';
      //   answerArea.innerHTML = '';
      // }
                              
    };
  }
  
  function addChecker(bool) {
  // This function adds a div element to the page
  // Used to see if it was correct or false
  
    var createDiv = document.createElement('div'),
        txt       = document.createTextNode(current + 1);
    
    createDiv.appendChild(txt);
    
    if (bool) {
      
      createDiv.className += 'correct';
      checker.appendChild(createDiv);
    } else {
      createDiv.className += 'false';
      checker.appendChild(createDiv);
    }
  }
  
  
  // Start the quiz right away
  loadQuestion(current);
  loadAnswers(current);
  
};