from . import views as v
from rest_framework import routers
from django.urls import path, include

router = routers.DefaultRouter()

router.register('user', v.UserViewSet)
router.register('menuitem', v.MenuItemViewSet)
router.register('cliente', v.ClienteViewSet)
router.register('produto', v.ProdutoViewSet)
router.register('venda', v.VendaViewSet)
router.register('vendaitems', v.VendaItemViewSet)
router.register('estoqueextrato', v.EstoqueExtratoViewSet)
router.register('saldoestoque', v.SaldoEstoqueViewSet)


urlpatterns = router.urls