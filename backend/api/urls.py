from . import views as v
from rest_framework import routers


router = routers.DefaultRouter()
router.register('user', v.UserViewSet)
router.register('cliente', v.ClienteViewSet)
router.register('produto', v.ProdutoViewSet)
router.register('venda', v.VendaViewSet)
router.register('vendaitems', v.VendaItemViewSet)


urlpatterns = router.urls

