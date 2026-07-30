# Updated for SQLite3 compatibility - replaced ArrayField with JSONField

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('helicopters', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='helicopter',
            name='features',
        ),
        migrations.RemoveField(
            model_name='helicopter',
            name='schedules',
        ),
        migrations.AddField(
            model_name='helicopter',
            name='features',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='helicopter',
            name='schedules',
            field=models.JSONField(blank=True, default=list),
        ),
    ]

