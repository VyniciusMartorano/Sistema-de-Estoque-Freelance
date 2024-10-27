from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from . import serializers as s
from . import models as m
from django.contrib.auth.models import Permission



class UserViewSet(viewsets.ModelViewSet):
    queryset = m.User.objects.all()
    serializer_class = s.UserSerializer
    # permission_classes = [AllowAny]

    def list(self, request):
        print(request.user)
        return Response(s.UserSerializer(request.user).data)


    @action(detail=False, methods=['post'])
    def update_password(self, *args, **kwargs):
        req = self.request.data
        email = req['email'] if 'email' in req else None
        password = req['password'] if 'password' in req else None

        if not (email and password):
            return Response(data='Envie o email e a senha', status=status.HTTP_400_BAD_REQUEST)

        user = m.User.objects.get(username=email)
        user.set_password(password)
        user.save()
        return Response(data='', status=status.HTTP_200_OK)

    


class MenuItemViewSet(viewsets.ViewSet):
    queryset = m.MenuItem.objects.all()


    def list(self, request):
        all_permissions = [
            Permission.objects.get(content_type__app_label=perm_name.split('.')[0], codename=perm_name.split('.')[1])
            for perm_name in request.user.get_all_permissions() if perm_name.startswith('api.menu')
        ]
        print(request.user.get_all_permissions())

        menuitems = [
            {
                'id': item_1.pk,
                'label': item_1.label,
                'icon': item_1.icon,
                'to': item_1.to_url,
                'father': None,
            }
            for item_1 in m.MenuItem.objects.filter(father__isnull=True).order_by('label') if
            item_1.permission in all_permissions]

        for item_1 in menuitems:
            menuitem_1 = m.MenuItem.objects.get(pk=item_1['id'], father_id=item_1['father'])
            filhos_01 = menuitem_1.children()

            if len(filhos_01):
                item_1['items'] = [
                    {
                        'id': item_2.pk,
                        'label': item_2.label,
                        'icon': item_2.icon,
                        'to': item_2.to_url,
                        'father': item_2.father.id,
                    } for item_2 in filhos_01 if item_2.permission in all_permissions]
                

                for item_2 in item_1['items']:
                    menuitem_2 = m.MenuItem.objects.get(pk=item_2['id'], father__id=item_2['father'])
                    filhos_02 = menuitem_2.children()
                    
                    if len(filhos_02):
                        item_2['items'] = [
                            {
                                'id': item_3.pk,
                                'label': item_3.label,
                                'icon': item_3.icon,
                                'to': item_3.to_url,
                                'father': item_3.father.id,
                            } for item_3 in filhos_02 if item_3.permission in all_permissions]
                        

                
        serializer = s.MenuItemSerializer(menuitems, many=True)
        return Response(serializer.data)



class ClienteViewSet(viewsets.ModelViewSet):
    queryset = m.Cliente.objects.using('default').all()
    serializer_class = s.ClienteSerializer


class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = m.Produto.objects.using('default').all()
    serializer_class = s.ProdutoSerializer


class VendaViewSet(viewsets.ModelViewSet):
    queryset = m.Venda.objects.using('default').all()
    serializer_class = s.VendaSerializer


class VendaItemViewSet(viewsets.ModelViewSet):
    queryset = m.VendaItem.objects.using('default').all()
    serializer_class = s.VendaItemSerializer


class EstoqueExtratoViewSet(viewsets.ModelViewSet):
    queryset = m.EstoqueExtrato.objects.using('default').all()
    serializer_class = s.EstoqueExtratoSerializer



class SaldoEstoqueViewSet(viewsets.ModelViewSet):
    queryset = m.SaldoEstoque.objects.using('default').all()
    serializer_class = s.SaldoEstoqueSerializer



