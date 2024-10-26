
from rest_framework import serializers
from . import models as m



class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.User
        fields = ('username', 'first_name', 'last_name', 'is_gerente', 'is_vendedor')


    def create(self, validated_data):
        user = m.User.objects.create(username=validated_data['username'])

        user.set_password(validated_data['password'])
        user.save()
        
        return user



class ClienteSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.Cliente
        fields = '__all__'



class ProdutoSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.Produto
        fields = '__all__'


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



