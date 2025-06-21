"""
URL configuration for food_diary_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
from django.urls import path, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter

from correlations.views import CorrelationView
from diary.views import UserEntriesAPIView
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from .views import health_check

from food.views import FoodsViewSet, IntakeViewSet
from symptoms.views import SymptomsViewSet, OccurrenceViewSet

router = DefaultRouter()
router.register(r'food', FoodsViewSet)
router.register(r'intakes', IntakeViewSet)
router.register(r'symptoms', SymptomsViewSet)
router.register(r'occurrence', OccurrenceViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/diary/', UserEntriesAPIView.as_view(), name='Diary'),
    path('api/correlations/', CorrelationView.as_view(), name='Correlations'),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/health/', health_check, name='health_check'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
