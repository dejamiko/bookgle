# Generated by Django 3.2.5 on 2022-02-07 21:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_alter_club_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='club',
            name='description',
            field=models.CharField(blank=True, max_length=500),
        ),
    ]