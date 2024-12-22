from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import Permission
from django.db.models import Sum, Q



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
    is_vendedor = models.BooleanField(default=False, null=True, blank=True)
    is_gerente = models.BooleanField(default=False, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'auth_user'


class GestoresVendedores(models.Model):
    vendedor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='vendedor'
    )
    gestor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='gestor'
    )

    class Meta:
        db_table = 'gestoresvendedores'
        managed = False


class Cliente(models.Model):
    nome = models.CharField(max_length=255)
    endereco = models.CharField(max_length=255, blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(unique=True)
    vendedor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

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

class EstoqueExtratoFunctions:

    def get_saldo_produto(self, produto_id):
        entradas = EstoqueExtrato.objects.filter(
            produto_id=produto_id, 
            tipo=EstoqueExtrato.ENTRADA
        ).aggregate(total=Sum('quantidade'))['total'] or 0

        saidas = EstoqueExtrato.objects.filter(
            produto_id=produto_id, 
            tipo=EstoqueExtrato.SAIDA
        ).aggregate(total=Sum('quantidade'))['total'] or 0

        return entradas - saidas

class EstoqueExtrato(models.Model):
    ENTRADA = 1
    SAIDA = 2
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
    quantidade = models.FloatField()
    
    tipo = models.IntegerField(choices=TIPO_CHOICES)
    tipomov = models.IntegerField(choices=TIPO_MOV_CHOICES)
    iddoc = models.IntegerField()

    functions = EstoqueExtratoFunctions()




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





class CI(models.Model):
    ENTRADA = 1
    SAIDA = 2
    TIPO_CHOICES = [
        (ENTRADA, 'CI'),
        (SAIDA, 'Venda'),
    ]
    data = models.DateField(null=False, blank=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    tipo = models.IntegerField(choices=TIPO_CHOICES)
    observacao = models.CharField(
        null=True, blank=True
    )


    class Meta:
        managed = False
        db_table = 'ci'

1
class CI_ITEM(models.Model):
    ci = models.ForeignKey(CI, on_delete=models.PROTECT)
    produto = models.ForeignKey(Produto, on_delete=models.PROTECT)
    quantidade = models.FloatField(null=False, blank=False)
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=False)


    class Meta:
        managed = False
        db_table = 'ci_itens'


class CustosProdutos(models.Model):
    ci = models.ForeignKey(
        CI,  
        db_column='ci_id',
        on_delete=models.CASCADE,
        related_name='ci'
    )
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
