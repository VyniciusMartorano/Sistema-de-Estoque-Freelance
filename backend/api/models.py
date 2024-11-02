from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import Permission



class MenuItem(models.Model):
    label = models.CharField(max_length=50)
    icon = models.CharField(max_length=50, blank=True, null=True)
    father = models.ForeignKey('MenuItem', on_delete=models.SET_NULL, null=True, blank=True)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    to_url = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'core_menuitem'
        managed = False
        ordering = ['label'] 

    def __str__(self):
        if not self.father:
            return self.label
        return f'{self.father} > {self.label}'

    def children(self):
        return MenuItem.objects.filter(father=self)





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


    class Meta:
        managed = False
        db_table = 'clientes'



class Produto(models.Model):
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    valor_minimo_venda = models.DecimalField(max_digits=10, decimal_places=2)
    valor_maximo_venda = models.DecimalField(max_digits=10, decimal_places=2)
    foto = models.ImageField(upload_to='produtos/', blank=True, null=True)
    trava_preco_adm = models.BooleanField(default=False)
    preco_fixo_adm = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'produtos'


class Venda(models.Model):
    data_venda = models.DateTimeField(auto_now_add=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    vendedor = models.ForeignKey(User, on_delete=models.CASCADE)


    class Meta:
        managed = False
        db_table = 'vendas'


class VendaItem(models.Model):
    venda = models.ForeignKey(Venda, related_name='itens', on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.IntegerField()
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)


    class Meta:
        managed = False
        db_table = 'vendasitens'



class EstoqueExtrato(models.Model):
    ENTRADA = 'entrada'
    SAIDA = 'saida'
    TIPO_CHOICES = [
        (ENTRADA, 'Entrada'),
        (SAIDA, 'Saída'),
    ]
    
    CI = 1
    VENDA = 2
    TIPO_MOV_CHOICES = [
        (CI, 'CI'),
        (VENDA, 'Venda'),
    ]

    data = models.DateTimeField(auto_now_add=True)
    produto = models.ForeignKey('Produto', on_delete=models.CASCADE)
    tipomov = models.IntegerField(choices=TIPO_MOV_CHOICES)
    iddoc = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'estoqueextrato'


class SaldoEstoque(models.Model):
    produto = models.ForeignKey('Produto', on_delete=models.CASCADE)
    gestor = models.ForeignKey(User, on_delete=models.CASCADE)
    saldo = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    class Meta:
        managed = False
        db_table = 'saldoestoque'



