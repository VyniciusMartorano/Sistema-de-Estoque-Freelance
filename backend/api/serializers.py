
from rest_framework import serializers
from . import models as m
from rest_framework_bulk import BulkSerializerMixin, BulkListSerializer
from django.db.models import F, Sum

class UserSerializer(serializers.ModelSerializer):
    tipo_label = serializers.SerializerMethodField()
    gestor = serializers.SerializerMethodField()

    def get_tipo_label(self, obj: m.User):
        return 'Gestor' if obj.is_gerente else 'Vendedor'

    def get_gestor(self, obj: m.User):
        if obj.is_vendedor:
            qs = m.GestoresVendedores.objects.get(vendedor_id=obj.pk)
            return qs.gestor.pk if qs else -1
        
        return None


    class Meta:
        model = m.User
        fields = ('id','username', 'first_name', 'last_name', 'is_gerente', 'is_vendedor', 'tipo_label', 'is_active', 'gestor')


    
class UserDTOSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    def get_label(self, obj: m.User):
        return f'{obj.pk} - {obj.first_name} {obj.last_name if obj.last_name else ''} ({'G' if obj.is_gerente else 'V'})'


    class Meta:
        model = m.User
        fields = ('id', 'label')





class MenuItemSerializer(serializers.Serializer):
    label = serializers.CharField(max_length=50)
    icon = serializers.CharField(max_length=50)
    to = serializers.CharField(max_length=25, required=False)
    father = serializers.IntegerField()
    items = serializers.ListField(
        child=serializers.DictField(),
        required=False
    )



class ClienteSerializer(serializers.ModelSerializer):
    vendedor_nome = serializers.SerializerMethodField()

    def get_vendedor_nome(self, obj: m.Cliente):
        return obj.vendedor.first_name if obj.vendedor else ''

    class Meta:
        model = m.Cliente
        fields = '__all__'



class ProdutoSerializer(serializers.ModelSerializer):
    percentual = serializers.SerializerMethodField()
    preco_compra = serializers.SerializerMethodField()
    label = serializers.SerializerMethodField()
    saldo_disponivel = serializers.SerializerMethodField()


    def get_label(self, obj: m.Produto):
        return f'{obj.pk} - {obj.nome}'

    def get_saldo_disponivel(self, obj: m.Produto):                                             
        user_id = self.context['user_id'] if 'user_id' in self.context else -1
        return m.EstoqueExtrato.functions.get_saldo_produto(obj.pk, user_id)
    


    def get_percentual(self, obj: m.Produto):
        user = self.context.get('request').user

        qs = m.ProdutosPrecosUsuarios.objects.filter(
            user_id=user.pk,
            produto_id=obj.pk
        )

        return qs.first().percentual if qs.exists() else None
    

    def get_preco_compra(self, obj: m.Produto):
        qs = m.CustosProdutos.objects.filter(produto_id=obj.pk).order_by('-dataent', '-id').first()
        custo = 0 if not qs else qs.preco_unitario
        user = self.context.get('request').user
        if user.is_staff: ...
        elif user.is_gerente:
            qs = m.ProdutosPrecosUsuarios.objects.filter(
                produto_id=obj.pk,user_id=m.User.objects.get(is_staff=1).pk
            ).first()

            custo = custo + (custo * (qs.percentual / 100)) if qs else custo
            
        elif user.is_vendedor:
            preco_adm = m.ProdutosPrecosUsuarios.objects.filter(
                produto_id=obj.pk,user_id=m.User.objects.get(is_staff=1).pk
            ).first()

            custo = custo + (custo * (preco_adm.percentual / 100)) if preco_adm else custo

            gestor_id = m.GestoresVendedores.objects.filter(vendedor_id=user.pk).first().gestor.pk
            
            preco_gestor = m.ProdutosPrecosUsuarios.objects.filter(
                produto_id=obj.pk,user_id=gestor_id
            ).first()
            custo = custo + (custo * (preco_gestor.percentual / 100)) if preco_gestor else custo



        return custo

    class Meta:
        model = m.Produto
        fields = '__all__'



class ProdutoDTOSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.Produto
        fields = ('id', 'nome', 'foto')


class VendaSerializer(serializers.ModelSerializer):
    total_venda = serializers.SerializerMethodField()

    def get_total_venda(self, obj: m.Venda):
        return m.VendaItem.objects.filter(
            venda=obj.pk
        ).aggregate(
            total_valor=Sum(F('quantidade') * F('vr_unitario'))
        )



    class Meta:
        model = m.Venda
        fields = '__all__'


class VendaItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.VendaItem
        fields = '__all__'



class EstoqueExtratoSerializer(serializers.ModelSerializer):
    produto_label = serializers.SerializerMethodField()
    user_label = serializers.SerializerMethodField()

    def get_produto_label(self, obj: m.EstoqueExtrato):
        return obj.produto.nome


    def get_user_label(self, obj: m.EstoqueExtrato):
        return obj.user.first_name

    class Meta:
        model = m.EstoqueExtrato
        fields = '__all__'





class ProdutosPrecosUsuariosSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.ProdutosPrecosUsuarios
        fields = '__all__'


class CISerializer(serializers.ModelSerializer):
    user_label = serializers.SerializerMethodField()

    def get_user_label(self, obj: m.EstoqueExtrato):
        return f'{obj.user.pk} - {obj.user.first_name} {obj.user.last_name}' 

    class Meta:
        model = m.CI
        fields = '__all__'


class CIITEMSerializer(BulkSerializerMixin,serializers.ModelSerializer):
    produto_label = serializers.SerializerMethodField()


    def create(self, validated_data):
        ci = validated_data['ci']
        user_id = m.CI.objects.get(pk=validated_data['ci'].pk).user.pk
        produto = validated_data['produto']
        preco_unitario = validated_data['preco_unitario']
        quantidade = validated_data['quantidade']

        if ci.tipo == m.CI.ENTRADA:
            custos_produto = m.CustosProdutos(
                produto=produto,
                preco_unitario=preco_unitario,
                quantidade=quantidade,
                dataent=ci.data,
                ci_id=ci.pk
            )
            custos_produto.save() 


        extrato = m.EstoqueExtrato(
            data=ci.data,
            produto=produto,
            user_id=user_id,
            quantidade=quantidade,
            tipo=ci.tipo,
            tipomov=m.EstoqueExtrato.CI,
            iddoc=ci.pk
        )
        extrato.save()
      
        instance = super().create(validated_data)
        return instance

    def get_produto_label(self, obj: m.CI_ITEM):
        return obj.produto.nome
    

    class Meta:
        model = m.CI_ITEM
        fields = '__all__'
        list_serializer_class = BulkListSerializer



