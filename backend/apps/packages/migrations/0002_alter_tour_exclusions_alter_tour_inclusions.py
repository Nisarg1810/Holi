# Updated for SQLite3 compatibility - replaced ArrayField with JSONField

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('packages', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tour',
            name='exclusions',
        ),
        migrations.RemoveField(
            model_name='tour',
            name='inclusions',
        ),
        migrations.AddField(
            model_name='tour',
            name='exclusions',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='tour',
            name='inclusions',
            field=models.JSONField(blank=True, default=list),
        ),
    ]

