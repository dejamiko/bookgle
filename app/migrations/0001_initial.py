# Generated by Django 3.2.5 on 2022-02-08 12:16

import app.models
from django.conf import settings
import django.contrib.auth.models
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('username', models.CharField(max_length=50, unique=True, validators=[django.core.validators.RegexValidator(message='Username must consist of at least three alphanumericals', regex='^\\w{3,}')])),
                ('email', models.EmailField(max_length=50, unique=True)),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('bio', models.CharField(blank=True, max_length=500)),
                ('location', models.CharField(blank=True, max_length=70)),
                ('birthday', models.DateField(validators=[app.models.PastDateValidator])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Book',
            fields=[
                ('ISBN', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=50, unique=True)),
                ('author', models.CharField(max_length=50)),
                ('publication_date', models.DateField(validators=[app.models.PastDateValidator])),
                ('publisher', models.CharField(max_length=50)),
                ('image_links_large', models.CharField(max_length=500)),
                ('image_links_medium', models.CharField(max_length=500)),
                ('image_links_small', models.CharField(max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='Club',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.CharField(blank=True, max_length=500)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('visibility', models.BooleanField(default=True)),
                ('public', models.BooleanField(default=True)),
                ('admins', models.ManyToManyField(related_name='admins', to=settings.AUTH_USER_MODEL)),
                ('applicants', models.ManyToManyField(related_name='applicants', to=settings.AUTH_USER_MODEL)),
                ('banned_users', models.ManyToManyField(related_name='banned_users', to=settings.AUTH_USER_MODEL)),
                ('books', models.ManyToManyField(related_name='books', to='app.Book')),
                ('members', models.ManyToManyField(related_name='members', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owner', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='EventVote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.book')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Vote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateTimeField(validators=[app.models.FutureDateValidator])),
                ('end_time', models.DateTimeField(validators=[app.models.FutureDateValidator])),
                ('event_vote', models.ManyToManyField(related_name='event_vote', to='app.EventVote')),
            ],
        ),
        migrations.CreateModel(
            name='Meeting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('location', models.CharField(max_length=70)),
                ('link', models.CharField(max_length=500)),
                ('discussion_leader', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ClubEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(max_length=500)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.book')),
                ('club_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.club')),
                ('meeting', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.meeting')),
                ('voting_time', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.vote')),
            ],
        ),
        migrations.CreateModel(
            name='BookRating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField(validators=[django.core.validators.MaxValueValidator(10), django.core.validators.MinValueValidator(1)])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.book')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='liked_books',
            field=models.ManyToManyField(related_name='liked_books', to='app.Book'),
        ),
        migrations.AddField(
            model_name='user',
            name='read_books',
            field=models.ManyToManyField(related_name='read_books', to='app.Book'),
        ),
        migrations.AddField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions'),
        ),
    ]
