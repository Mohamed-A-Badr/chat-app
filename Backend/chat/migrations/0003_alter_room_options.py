# Generated by Django 5.1.6 on 2025-02-21 00:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_rename_group_room_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='room',
            options={'ordering': ['-created_at'], 'verbose_name': 'Room', 'verbose_name_plural': 'Rooms'},
        ),
    ]
