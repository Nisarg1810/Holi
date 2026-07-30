# Updated for SQLite3 compatibility - replaced ArrayField with JSONField

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('boats', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='boat',
            name='schedules',
        ),
        migrations.AddField(
            model_name='boat',
            name='schedules',
            field=models.JSONField(blank=True, default=list),
        ),
    ]

