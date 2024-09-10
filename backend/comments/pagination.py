from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPageNumberPagination(PageNumberPagination):
    """ Customize response with total_pages """

    def get_paginated_response(self, data):
        paginated_response = super().get_paginated_response(data)

        paginated_response_data = {
            'total_pages': self.page.paginator.num_pages,
            'count': paginated_response.data['count'],
            'next': paginated_response.data['next'],
            'previous': paginated_response.data['previous'],
            'results': paginated_response.data['results']
        }
        return Response(paginated_response_data)
