from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from . import serializers as s
from . import models as m
from django.contrib.auth.models import Permission
from . import filters as f 
from django.db.models import Q
from rest_framework.exceptions import ValidationError
from rest_framework_bulk import BulkModelViewSet
from django.contrib.auth.models import Group



class UserViewSet(viewsets.ModelViewSet):
    queryset = m.User.objects.all()
    serializer_class = s.UserSerializer
    # permission_classes = [AllowAny]

    def list(self, request):
        return Response(s.UserSerializer(request.user).data)
    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data

        # Verificar se a senha está no corpo da requisição
        if "password" in data:
            new_password = data.pop("password")
            instance.set_password(str(new_password))
            instance.save()
        
        # Atualizar outros campos se fornecidos
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)
    

    @action(detail=False, methods=['post'])
    def search(self, *args, **kwargs):
        req = self.request.data
        nome = req['nome'] if 'nome' in req else None
        tipo = req['tipo'] if 'tipo' in req else None
        ativo = req['ativo'] if 'ativo' in req else None

        queryset = m.User.objects.all().filter(
             ~Q(is_staff=1)
        )

        if nome:
            queryset = queryset.filter(first_name__icontains=nome)
        if ativo:
            queryset = queryset.filter(is_active=ativo)
        
        if tipo:
            if tipo == 1:
                queryset = queryset.filter(is_gerente=1)
            elif tipo == 2:
                queryset = queryset.filter(is_vendedor=1)

        serializer = s.UserSerializer(queryset, many=True)

        return Response(serializer.data)
    


    @action(detail=False, methods=['GET'])
    def get_gestores(self, *args, **kwargs):
        qs = m.User.objects.filter(Q(is_gerente=1), Q(is_active=1), ~Q(is_staff=1))
        serializer = s.UserSerializer(qs, many=True).data
        return Response(data=serializer, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'])
    def get_all(self, *args, **kwargs):
        qs = m.User.objects.all().filter(Q(is_active=1), ~Q(is_staff=1)).order_by('-id')
        serializer = s.UserDTOSerializer(qs, many=True).data
        return Response(data=serializer, status=status.HTTP_200_OK)



    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        password = data.pop('password', None)
        
        if m.User.objects.filter(username=data['username']).exists():
            return Response(
                {'detail': 'Este nome de usuário já está em uso!'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
     
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        user.set_password(str(password))
        user.save()

        if data['is_vendedor'] == 1:
            m.GestoresVendedores.objects.create(
                vendedor_id=user.id,
                gestor_id=data['gestor']
            )
            
            vendedor_group = Group.objects.filter(name='vendedor').first()
            if vendedor_group:
                user.groups.add(vendedor_group)
        else:
            gestor_group = Group.objects.filter(name='gestor').first()
            if gestor_group:
                user.groups.add(gestor_group)



        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)



class PermissionViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response(request.user.get_all_permissions())



class MenuItemViewSet(viewsets.ViewSet):
    queryset = m.MenuItem.objects.all()


    def list(self, request):
        all_permissions = [
            Permission.objects.get(content_type__app_label=perm_name.split('.')[0], codename=perm_name.split('.')[1])
            for perm_name in request.user.get_all_permissions() if perm_name.startswith('api.menu')
        ]

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
    filterset_class = f.ClienteFilter


    
    def list(self, request):
        qs = m.Cliente.objects.using('default').all()
        user = self.request.user

        if user.is_staff:
           pass
        elif user.is_gerente:
            vendedores = m.GestoresVendedores.objects.filter(
               gestor=user.pk 
            ).values_list('vendedor_id', flat=True)

            qs = qs.filter(vendedor__in=vendedores)
        elif user.is_vendedor:
            qs.filter(vendedor=user.pk)

        serializer = self.serializer_class(qs, many=True).data
        return Response(data=serializer, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def search(self, *args, **kwargs):
        req = self.request.data
        nome = req['nome'] if 'nome' in req else None
        vendedor_id = req['vendedor_id'] if 'vendedor_id' in req else None

        queryset = m.Cliente.objects.all()

        if nome:
            queryset = queryset.filter(nome__istartswith=nome)
        
        if vendedor_id:
            queryset = queryset.filter(vendedor_id=vendedor_id)

        serializer = s.ClienteSerializer(queryset, many=True)

        return Response(serializer.data)
    


class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = m.Produto.objects.using('default').all()
    serializer_class = s.ProdutoSerializer

    @action(detail=False, methods=['get'])
    def get_produtos_dto(self, *args, **kwargs):
        user_id = self.request.query_params.get('user_id')
        qs = m.Produto.objects.all()

        serializer = self.serializer_class(
            qs, many=True, context={
                'user_id': user_id, 
                'request': self.request
            }
        ).data
        return Response(data=serializer, status=status.HTTP_200_OK)
    

    @action(detail=False, methods=['get'])
    def search(self, *args, **kwargs):
        query = self.request.GET.get("query", "")

        queryset = m.Produto.objects.filter(
            Q(nome__icontains=query) |
            Q(descricao__icontains=query) 
        )

        serializer = s.ProdutoDTOSerializer(queryset, many=True)
        return Response(serializer.data)
    

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        user = request.user

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        m.ProdutosPrecosUsuarios.objects.update_or_create(
            user_id=user.pk,
            produto_id=instance.pk,
            defaults={
                'percentual': request.data['percentual']
            }
        )

        self.perform_update(serializer)
        return Response(serializer.data)
    

    def create(self, request, *args, **kwargs):
        user = request.user

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        user_adm = m.User.objects.get(is_staff=1)

        if not user.is_staff:
            m.ProdutosPrecosUsuarios.objects.create(
                user_id=user_adm.pk,
                produto_id=instance.pk,
                percentual=20
            )


        m.ProdutosPrecosUsuarios.objects.update_or_create(
            user_id=user.pk,
            produto_id=instance.pk,
            percentual=request.data['percentual']
        )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        qs_venda = m.VendaItem.objects.filter(
            produto_id=instance.pk
        )

        qs_estoque_mov = m.EstoqueExtrato.objects.filter(
            produto_id=instance.pk
        )
        
        if (qs_estoque.count() + qs_estoque_mov.count() + qs_venda.count()) > 0:
            return Response(
                data='Não é possivel apagar um produto que ja tem [vendas, estoque] registrados(as).',
                status=status.HTTP_400_BAD_REQUEST
            )
        
        m.ProdutosPrecosUsuarios.objects.filter(produto=instance.pk).delete()
        
        self.perform_destroy(instance)
        
        return Response(
            {"detail": "Produto deletado com sucesso."},
            status=status.HTTP_204_NO_CONTENT
        )



class VendaViewSet(viewsets.ModelViewSet):
    queryset = m.Venda.objects.using('default').all()
    serializer_class = s.VendaSerializer


    @action(detail=False, methods=['post'])
    def search(self, *args, **kwargs):
        queryset = m.Venda.objects.order_by('-id')
        req = self.request.data
        usuario = self.request.user

        de = req['de'] if 'de' in req else None
        ate = req['ate'] if 'ate' in req else None
        cliente = req['cliente'] if 'cliente' in req else None
        user = req['user'] if 'user' in req else None


        if usuario.is_staff: pass
        elif usuario.is_gerente: 
            vendedores = m.GestoresVendedores.objects.filter(gestor_id=usuario.pk).values_list('vendedor_id', flat=True)
            clientes = m.Cliente.objects.filter(vendedor_id__in=vendedores).values_list('pk', flat=True)
            queryset = queryset.filter(cliente_id__in=clientes)
        elif usuario.is_vendedor: 
            clientes = m.Cliente.objects.filter(vendedor_id=usuario.pk).values_list('pk', flat=True)
            queryset = queryset.filter(cliente_id__in=clientes)


        if de:
            queryset = queryset.filter(data_venda__gte=de)

        if ate:
            queryset = queryset.filter(data_venda__lte=ate)
        
        if cliente:
            queryset = queryset.filter(cliente=cliente)

        if user:
            queryset = queryset.filter(user=user)

        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)
    


    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        vendaId = instance.pk
        
        self.perform_destroy(instance)


        m.VendaItem.objects.filter(
            venda_id=vendaId
        ).delete()

        m.EstoqueExtrato.objects.filter(
            iddoc=vendaId,
            tipomov=m.EstoqueExtrato.VENDA
        ).delete()
        
        
        return Response(
            {"detail": "Produto deletado com sucesso."},
            status=status.HTTP_204_NO_CONTENT
        )


class VendaItemViewSet(BulkModelViewSet):
    queryset = m.VendaItem.objects.using('default').all()
    serializer_class = s.VendaItemSerializer


    @action(detail=False, methods=['post'])
    def search(self, *args, **kwargs):
        req = self.request.data
        queryset = m.VendaItem.objects.all()

        vendaId = req['vendaId'] if 'vendaId' in req else None

        
        if vendaId:
            queryset = queryset.filter(venda_id=vendaId)
        
        serializer = self.serializer_class(queryset.order_by('-id'), many=True)

        return Response(serializer.data)
    



class EstoqueExtratoViewSet(viewsets.ModelViewSet):
    queryset = m.EstoqueExtrato.objects.using('default').all()
    serializer_class = s.EstoqueExtratoSerializer

    @action(detail=False, methods=['post'])
    def search(self, *args, **kwargs):
        req = self.request.data

        de = req['de'] if 'de' in req else None
        ate = req['ate'] if 'ate' in req else None
        tipo = req['tipo'] if 'tipo' in req else None
        tipomov = req['tipomov'] if 'tipomov' in req else None
        user = req['user'] if 'user' in req else None
        produto = req['produto'] if 'produto' in req else None

        queryset = m.EstoqueExtrato.objects.order_by('-id')

        if de:
            queryset = queryset.filter(data__gte=de)

        if ate:
            queryset = queryset.filter(data__lte=ate)
        
        if tipo:
            queryset = queryset.filter(tipo=tipo)

        if tipomov:
            queryset = queryset.filter(tipomov=tipomov)
        
        if user:
            queryset = queryset.filter(user=user)

        if produto:
            queryset = queryset.filter(produto=produto)

        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


    @action(detail=False, methods=['post'])
    def search_saldos(self, *args, **kwargs):
        req = self.request.data

        user_filter = req['user'] if 'user' in req else None
        produto_filter = req['produto'] if 'produto' in req else None

        produtos = m.Produto.objects.all()
        usuarios = [self.request.user]

        
        if self.request.user.is_gerente and not user_filter:    
            usuarios = list(m.GestoresVendedores.objects.filter(gestor_id=self.request.user.pk).values_list('vendedor', flat=True, ))
            usuarios.insert(0, self.request.user.pk)

            usuarios = [m.User.objects.get(pk=i) for i in usuarios]


        if user_filter:
            usuarios = [m.User.objects.get(pk=user_filter)]

        if produto_filter:
            produtos = produtos.filter(pk=produto_filter)
        
        itens = []
        for u in usuarios:
            for p in produtos:
                itens.append({
                    'user_label': f"{u.first_name} {u.last_name if u.last_name else ''}",
                    'produto_label': f'{p.pk} - {p.nome}',
                    'saldo': m.EstoqueExtrato.functions.get_saldo_produto(p.pk, u.pk),
                })

        return Response(itens, status=status.HTTP_200_OK)



class ProdutosPrecosUsuariosViewSet(viewsets.ModelViewSet):
    queryset = m.ProdutosPrecosUsuarios.objects.using('default').all()
    serializer_class = s.ProdutosPrecosUsuariosSerializer



class CIViewSet(viewsets.ModelViewSet):
    queryset = m.CI.objects.all()
    serializer_class = s.CISerializer

    def create(self, request, *args, **kwargs):
        validated_data = request.data
        validated_data['created_by'] = request.user.id
        
        serializer = self.get_serializer(data=validated_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def search(self, *args, **kwargs):
        req = self.request.data

        de = req['de'] if 'de' in req else None
        ate = req['ate'] if 'ate' in req else None
        observacao = req['observacao'] if 'observacao' in req else None
        user = req['user'] if 'user' in req else None
        tipo = req['tipo'] if 'tipo' in req else None

        queryset = m.CI.objects.all()

        if de:
            queryset = queryset.filter(data__gte=de)
        if ate:
            queryset = queryset.filter(data__lte=ate)
        
        if user:
            queryset = queryset.filter(user=user)
        
        if tipo:
            queryset = queryset.filter(tipo=tipo)
        
        if observacao:
            queryset = queryset.filter(observacao__icontains=observacao)

        serializer = s.CISerializer(queryset.order_by('-id'), many=True)

        return Response(serializer.data)
    


class CIITEMViewSet(BulkModelViewSet):
    queryset = m.CI_ITEM.objects.all()
    serializer_class = s.CIITEMSerializer




    @action(detail=False, methods=['post'])
    def search(self, *args, **kwargs):
        req = self.request.data
        
        ci_id = req['ci_id'] if 'ci_id' in req else None

        queryset = m.CI_ITEM.objects.all()
        
        if ci_id:
            queryset = queryset.filter(ci=ci_id)

        serializer = self.serializer_class(queryset.order_by('-id'), many=True)

        return Response(serializer.data)
