from django_filters import rest_framework as filters
from . import models as m




class ClienteFilter(filters.FilterSet):
    nome = filters.CharFilter(lookup_expr='icontains')      
    endereco = filters.CharFilter(lookup_expr='icontains')    
    telefone = filters.CharFilter(lookup_expr='icontains')   
    email = filters.CharFilter(lookup_expr='icontains')      
    vendedor_id = filters.NumberFilter(field_name='vendedor')    

    class Meta:
        model = m.Cliente
        fields = ['nome', 'endereco', 'telefone', 'email', 'vendedor_id']