from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!

    def setUp(self):
        """Set up for tests"""

        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_board(self):
        """Make sure information is in the session and HTML is displayed"""

        with self.client:
            response = self.client.get('/')
            self.assertEqual(response.status_code, 200)
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('nplays'))
            self.assertIn(b'Score:', response.data)
            self.assertIn(b'Timer:', response.data)

    def test_guess(self):
        """Make sure word guesses are properly handled on the HTML"""

        with self.client as client:
            with client.session_transaction() as ssn:
                ssn['board'] = [["F", "R", "K", "L", "K"], 
                                 ["C", "K", "T", "G", "S"], 
                                 ["G", "S", "Q", "I", "E"], 
                                 ["M", "Y", "C", "P", "T"], 
                                 ["C", "A", "T", "L", "P"]]
            response = self.client.get('/word-guess?input=pig')
            self.assertEqual(response.json['Result'], 'ok')
