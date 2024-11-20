
from rest_framework import serializers
from . import models as m



class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.User
        fields = ('id','username', 'first_name', 'last_name', 'is_gerente', 'is_vendedor')


    def create(self, validated_data):
        user = m.User.objects.create(username=validated_data['username'])

        user.set_password(validated_data['password'])
        user.save()
        
        return user

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
    gestor_nome = serializers.SerializerMethodField()

    def get_gestor_nome(self, obj: m.Cliente):
        return obj.gestor.first_name if obj.gestor else ''

    class Meta:
        model = m.Cliente
        fields = '__all__'



class ProdutoSerializer(serializers.ModelSerializer):
    percentual = serializers.SerializerMethodField()
    preco_compra = serializers.SerializerMethodField()


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
        if user.is_adm: ...
        elif user.is_gerente:
            qs = m.ProdutosPrecosUsuarios.objects.filter(
                produto_id=obj.pk,user_id=m.User.objects.get(is_adm=1).pk
            ).first()

            custo = custo + (custo * (qs.percentual / 100)) if qs else custo
            
        elif user.is_vendedor:
            preco_adm = m.ProdutosPrecosUsuarios.objects.filter(
                produto_id=obj.pk,user_id=m.User.objects.get(is_adm=1).pk
            ).first()

            custo = custo + (custo * (preco_adm.percentual / 100)) if preco_adm else custo

            gestor_id = m.GestoresVendedores.objects.filter(vendedor_id=user.pk).first().pk
            
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

    class Meta:
        model = m.Venda
        fields = '__all__'


class VendaItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.VendaItem
        fields = '__all__'



class EstoqueExtratoSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.EstoqueExtrato
        fields = '__all__'





class ProdutosPrecosUsuariosSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.ProdutosPrecosUsuarios
        fields = '__all__'



