from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView



urlpatterns = [
    path('admin/', admin.site.urls),
    path('core/api/', include('api.urls')),
    path('core/token/', TokenObtainPairView.as_view()),
    path('core/token/refresh/', TokenRefreshView.as_view()),
    path('core/token/verify/', TokenVerifyView.as_view())
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
