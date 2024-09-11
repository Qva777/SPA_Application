#!/bin/bash
echo "Applying fixtures"
python manage.py loaddata first_start/fixtures/users_fixture.json
python manage.py loaddata first_start/fixtures/comments_fixture.json
