"""Unit tests for the time vote model"""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import User, Book, TimeVote, TimePeriod


class TimeVoteModelTest(TestCase):
    """Test the time vote model"""

    fixtures = [
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/default_time_period.json',
        'app/tests/fixtures/default_time_vote.json',
    ]

    def setUp(self):
        self.book = Book.objects.get(title="Harry Potter and the Sorcerer's Stone")
        self.user = User.objects.get(username="johndoe")
        self.time = TimePeriod.objects.get(pk=1)
        self.time_vote = TimeVote.objects.get(pk=1)

    def test_valid_time_vote(self):
        try:
            self.time_vote.full_clean()
        except ValidationError:
            self.fail("Time vote should be valid")

    def test_empty_user(self):
        self.time_vote.user = None
        self._assert_invalid_time_vote()

    def test_empty_time_period(self):
        self.time_vote.time_period = None
        self._assert_invalid_time_vote()

    def _assert_invalid_time_vote(self):
        with self.assertRaises(ValidationError):
            self.time_vote.full_clean()
