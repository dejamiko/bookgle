"""Unit tests for the Club model."""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import Club, User, Book


class ClubModelTestCase(TestCase):
    """Unit tests for the Club model."""

    fixtures = [
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/default_club.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/others_clubs.json',
        'app/tests/fixtures/other_books.json'
    ]

    def setUp(self):
        self.club = Club.objects.get(name="Joe's Club")
        self.new_user = User.objects.get(username='jakedoe')
        self.book = Book.objects.get(title="Ender's Game")


    def test_valid_club(self):
        self._assert_club_is_valid()

    def test_name_cannot_be_blank(self):
        self.club.name = ''
        self._assert_club_is_invalid()

    def test_name_can_be_50_characters_long(self):
        self.club.name = 'x' * 50
        self._assert_club_is_valid()

    def test_name_cannot_be_over_50_characters_long(self):
        self.club.name = 'x' * 51
        self._assert_club_is_invalid()

    def  test_description_can_be_blank(self):
        self.club.description = ''
        self._assert_club_is_valid()

    def test_description_can_be_500_characters_long(self):
        self.club.description = 'x' * 500
        self._assert_club_is_valid()

    def test_description_cannot_be_over_500_characters_long(self):
        self.club.description = 'x' * 501
        self._assert_club_is_invalid()

    def test_description_need_not_be_unique(self):
        second_club = Club.objects.get(name="Jane's Club")
        self.club.description = second_club.description
        self._assert_club_is_valid()

    def test_owner_cannot_be_none(self):
        self.club.owner = None
        self._assert_club_is_invalid()

    def test_visibility_defaults_to_true(self):
        self.assertTrue(self.club.visibility)

    def test_switch_visibility(self):
        self.club.visibility = False
        self.assertFalse(self.club.visibility)
        self.club.switch_visibility()
        self.assertTrue(self.club.visibility)

    def test_public_defaults_to_true(self):
        self.assertTrue(self.club.public)

    def test_switch_public(self):
        self.club.public = False
        self.assertFalse(self.club.public)
        self.club.switch_public()
        self.assertTrue(self.club.public)

    def test_add_member(self):
        self.assertEqual(self.club.members.count(), 1)
        self.club.add_member(self.new_user)
        self.assertEqual(self.club.members.count(), 2)

    def test_remove_member(self):
        self.club.add_member(self.new_user)
        self.assertEqual(self.club.members.count(), 2)
        self.club.remove_member(self.new_user)
        self.assertEqual(self.club.members.count(), 1)

    def test_member_count(self):
        self.assertEqual(self.club.member_count(), self.club.members.count())
        self.club.add_member(self.new_user)
        self.assertEqual(self.club.member_count(), self.club.members.count())

    def test_add_admin(self):
        self.assertEqual(self.club.admins.count(), 1)
        self.club.add_admin(self.new_user)
        self.assertEqual(self.club.admins.count(), 2)

    def test_remove_admin(self):
        self.club.add_admin(self.new_user)
        self.assertEqual(self.club.admins.count(), 2)
        self.club.remove_admin(self.new_user)
        self.assertEqual(self.club.admins.count(), 1)
    
    def test_admin_count(self):
        self.assertEqual(self.club.admin_count(), self.club.admins.count())
        self.club.add_admin(self.new_user)
        self.assertEqual(self.club.admin_count(), self.club.admins.count())

    def test_add_applicant(self):
        self.assertEqual(self.club.applicants.count(), 1)
        self.club.add_applicant(self.new_user)
        self.assertEqual(self.club.applicants.count(), 2)

    def test_remove_applicant(self):
        self.club.add_applicant(self.new_user)
        self.assertEqual(self.club.applicants.count(), 2)
        self.club.remove_applicant(self.new_user)
        self.assertEqual(self.club.applicants.count(), 1)

    def test_applicant_count(self):
        self.assertEqual(self.club.applicant_count(), self.club.applicants.count())
        self.club.add_applicant(self.new_user)
        self.assertEqual(self.club.applicant_count(), self.club.applicants.count())

    def test_total_people_count(self):
        self.assertEqual(self.club.total_people_count(), self.club.members.count() + self.club.admins.count() + 1)
        self.club.add_member(self.new_user)
        self.assertEqual(self.club.total_people_count(), self.club.members.count() + self.club.admins.count() + 1)

    def test_add_banned_user(self):
        self.assertEqual(self.club.banned_users.count(), 1)
        self.club.add_banned_user(self.new_user)
        self.assertEqual(self.club.banned_users.count(), 2)

    def test_remove_banned_user(self):
        self.club.add_banned_user(self.new_user)
        self.assertEqual(self.club.banned_users.count(), 2)
        self.club.remove_banned_user(self.new_user)
        self.assertEqual(self.club.banned_users.count(), 1)

    def test_banned_user_count(self):
        self.assertEqual(self.club.banned_user_count(), self.club.banned_users.count())
        self.club.add_banned_user(self.new_user)
        self.assertEqual(self.club.banned_user_count(), self.club.banned_users.count())

    def test_add_book(self):
        self.assertEqual(self.club.books.count(), 1)
        self.club.add_book(self.book)
        self.assertEqual(self.club.books.count(), 2)

    def test_remove_book(self):
        self.club.add_book(self.book)
        self.assertEqual(self.club.books.count(), 2)
        self.club.remove_book(self.book)
        self.assertEqual(self.club.books.count(), 1)

    def test_book_count(self):
        self.assertEqual(self.club.book_count(), self.club.books.count())
        self.club.add_book(self.book)
        self.assertEqual(self.club.book_count(), self.club.books.count())

    

    

    

    def _assert_club_is_valid(self):
        try:
            self.club.full_clean()
        except (ValidationError):
            self.fail('Test club should be valid')

    def _assert_club_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.club.full_clean()

   