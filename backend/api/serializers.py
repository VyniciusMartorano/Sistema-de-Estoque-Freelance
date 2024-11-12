
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



class SaldoEstoqueSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.SaldoEstoque
        fields = '__all__'



