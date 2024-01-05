class BoggleGame {

    constructor(boardId) {
        this.secs = 60;
        this.score = 0;
        this.words = new Set();  //keep track of words guessed right
        this.board = $("#" + boardId);
        this.timer = setInterval(this.time.bind(this), 1000)
    
        $("#guessForm", this.board).on("submit", this.handleGuess.bind(this))
      }

    async time() {
        $(".timer").text("Timer: " + this.secs-- + " sec");
        if(this.secs == -1){
            clearInterval(this.timer);
            $('#guessForm', this.board).remove()
            $('#guessResponses', this.board).children().remove();
            await this.scoreGame();
        }
    }

      showResponse(cls, msg){
        $('#guessResponses', this.board).append(`<p class='${cls}'>${msg}</p>`)
      }

      async handleGuess(event) {
        event.preventDefault();

        //clear message section
        $('#guessResponses', this.board).children().remove();
        
        //get user's input (guess)
        const guess = $('#inputGuess', this.board).val()
        $('#inputGuess').val('')

        //check if word has been used
        if (this.words.has(guess)) {
            this.showResponse("not-word-response", "You already guessed that word :o")
            return
        }
        
        //request response from server to check if word is valid
        let response = await axios.get('http://127.0.0.1:5000/word-guess', {params:{input:guess}})
    
    
        if(response.data.Result == "not-word"){
            this.showResponse("not-word-response", "That's not a valid word ):")
        }else if(response.data.Result == "ok"){
            this.score += guess.length
            this.words.add(guess);
            $('.score', this.board).text("Score: " + this.score)
            this.showResponse("ok-response", "That's a valid word! Keep it up (:")
        }else if(response.data.Result == "not-on-board"){
            this.showResponse("not-on-board-response", "That word is not on your board /:")
        }
    }

    async scoreGame() {
        this.showResponse("not-word-response", "Game over, refresh to play again!")
        const resp = await axios.post("/post-score", { score: this.score });
        if (resp.data.brokeRecord) {
          this.showResponse("ok-response", `New record: ${this.score}`);
        } else {
          this.showResponse("not-on-board-response", `Final score: ${this.score}`, "ok");
        }
      }
}



// score = 0

// var count = 59, timer = setInterval(function() {
//     $(".timer").text("Timer: " + count-- + " sec");
//     if(count == -1){
//         clearInterval(timer);
//         $('#guessForm').remove()
//         $('#guessResponses').children().remove();
//         $('#guessResponses').append("<p class='not-word-response'>Game over, refresh to play again!</p>")
//     }
// }, 1000);

// async function handleGuess(event) {
//     event.preventDefault();

//     const guess = $('#inputGuess').val()
//     $('#inputGuess').val('')
//     console.log(guess)

//     let response = await axios.get('http://127.0.0.1:5000/word-guess', {params:{input:guess}})

//     result = response.data.Result

//     $('#guessResponses').children().remove();

//     if(result == "not-word"){
//         $('#guessResponses').append("<p class='not-word-response'>That's not a valid word ):</p>")
//     }else if(result == "ok"){
//         score += guess.length
//         $('.score').text("Score: " + score)
//         $('#guessResponses').append("<p class='ok-response'>That's a valid word! Keep it up (:</p>")
//     }else if(result == "not-on-board"){
//         $('#guessResponses').append("<p class='not-on-board-response'>That word is not on your board /:</p>")
//     }
// }

// $("#guessForm").on("submit", handleGuess)