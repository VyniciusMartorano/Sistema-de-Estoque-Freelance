from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError


class User(AbstractUser):
    is_vendedor = models.BooleanField(default=False)
    is_gerente = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = 'auth_user'


class Cliente(models.Model):
    nome = models.CharField(max_length=255)
    endereco = models.CharField(max_length=255, blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(unique=True)
    gestor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.nome
    
    def clean(self):
        super().clean()
        if not self.is_gerente and not self.is_vendedor:
            raise ValidationError('Pelo menos um dos campos "is_gerente" ou "is_vendedor" deve ser preenchido.')

    

    class Meta:
        managed = False
        db_table = 'clientes'