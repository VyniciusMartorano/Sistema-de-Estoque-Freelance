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
    is_adm = models.BooleanField(default=False)
    is_vendedor = models.BooleanField(default=False)
    is_gerente = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = 'auth_user'


class GestoresVendedores(models.Model):
    vendedor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='gestores'
    )
    gestor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='vendedores'
    )

    class Meta:
        db_table = 'gestoresvendedores'
        unique_together = ('vendedor', 'gestor')


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


def upload_pessoa_image(instance, filename):
    qs = Produto.objects.order_by('-id').first()
    last_id = qs.pk if qs else 1
    return f'produtos/{last_id}-{instance.nome}-{filename}'


class Produto(models.Model):
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    foto = models.ImageField( blank=True, null=True, upload_to=upload_pessoa_image)

    class Meta:
        managed = False
        db_table = 'produtos'


class CustosProdutos(models.Model):
    produto = models.ForeignKey(Produto,on_delete=models.CASCADE)
    preco_unitario = models.DecimalField(max_digits=10,decimal_places=2)
    quantidade = models.FloatField()
    dataent = models.DateField()

    class Meta:
        managed = False
        db_table = 'CustosProdutos'

class Venda(models.Model):
    data_venda = models.DateTimeField(auto_now_add=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)



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
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    tipomov = models.IntegerField(choices=TIPO_MOV_CHOICES)
    iddoc = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'estoqueextrato'




class ProdutosPrecosUsuarios(models.Model):
    produto = models.ForeignKey('Produto', on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    percentual = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    class Meta:
        managed = False
        db_table = 'produtosprecosusuarios'



class CustosProdutos(models.Model):
    produto = models.ForeignKey(
        Produto,  
        on_delete=models.CASCADE,
        db_column='produto_id',
        related_name='custos'
    )
    preco_unitario = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    quantidade = models.DecimalField(
        max_digits=10,
        decimal_places=3
    )
    dataent = models.DateField(db_column='dataent')

    
    class Meta:
        managed = False
        db_table = 'custosprodutos'




