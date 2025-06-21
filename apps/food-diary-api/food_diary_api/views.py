from django.http import JsonResponse
from django.db import connections, OperationalError


def health_check(request):
    db_ok = True
    errors = []


    for conn in connections.all():
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT 1")
        except OperationalError as e:
            db_ok = False
            errors.append(str(e))


    status_code = 200 if db_ok else 503
    return JsonResponse({
        "status": "ok" if db_ok else "unhealthy",
        "errors": errors if not db_ok else None
    }, status=status_code)