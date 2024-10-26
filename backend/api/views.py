import sys, random, os, smtplib
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework import status
from . import serializers as s
from . import models as m




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

        user = User.objects.get(username=email)
        user.set_password(password)
        user.save()
        return Response(data='', status=status.HTTP_200_OK)

    


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



