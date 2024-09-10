from django.core.exceptions import ValidationError


def validate_not_descendant(comment, parent):
    """ Check if the parent comment is a descendant of the current comment """
    while parent:
        if parent == comment:
            raise ValidationError("A comment cannot be a descendant of itself ")
        parent = parent.parent


