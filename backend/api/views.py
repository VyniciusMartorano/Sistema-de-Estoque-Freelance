import sys, random, os, smtplib
from email.message import  EmailMessage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from rest_framework import viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework import status
from datetime import datetime, timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from . import serializers as s
from . import models as m




class UserViewSet(viewsets.ViewSet):
    queryset = User.objects.all()
    serializer_class = s.UserSerializer
    permission_classes = [AllowAny]



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

    



