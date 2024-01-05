from flask import Flask, request, render_template, redirect, flash, session, make_response, jsonify
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "4sdlkspdfkps#$RGR^HDG"

boggle_game = Boggle()

@app.route('/')
def setup_board():
    """ Set up the game board and add a form to submit guesses"""
    board = boggle_game.make_board()
    session['board'] = board
    return render_template("board.html", board=board)

@app.route('/word-guess')
def guess():
    
    guess = request.args.get('input').lower()
    board = session["board"]
    is_valid = boggle_game.check_valid_word(board, guess)
    return jsonify({"Result": is_valid})

@app.route("/post-score", methods=["POST"])
def post_score():

    session['nplays'] = session.get("nplays", 0) + 1
    session['highscore'] = max(request.json["score"], session.get("highscore", 0))

    return jsonify(brokeRecord = request.json["score"] > session.get("highscore", 0))