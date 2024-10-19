
from rest_framework import serializers
from . import models as m



class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.User
        fields = '*'


    def create(self, validated_data):
        user = m.User.objects.create(username=validated_data['username'])

        user.set_password(validated_data['password'])
        user.save()
        
        return user



class ClienteSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.Cliente
        fields = '*'



class ProdutoSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.Produto
        fields = '*'


class VendaSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.Venda
        fields = '*'


class VendaItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.VendaItem
        fields = '*'



class EstoqueExtratoSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.EstoqueExtrato
        fields = '*'



class SaldoEstoqueSerializer(serializers.ModelSerializer):

    class Meta:
        model = m.SaldoEstoque
        fields = '*'



