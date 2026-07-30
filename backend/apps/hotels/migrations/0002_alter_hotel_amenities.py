# Updated for SQLite3 compatibility - replaced ArrayField with JSONField

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hotels', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hotel',
            name='amenities',
        ),
        migrations.AddField(
            model_name='hotel',
            name='amenities',
            field=models.JSONField(blank=True, default=list),
        ),
    ]

