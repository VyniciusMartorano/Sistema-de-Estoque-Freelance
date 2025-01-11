from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView



urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/core/', include('api.urls')),
    path('api/core/token/', TokenObtainPairView.as_view()),
    path('/api/core/token/refresh/', TokenRefreshView.as_view()),
    path('/api/core/token/verify/', TokenVerifyView.as_view())
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
