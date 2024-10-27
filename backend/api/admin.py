from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Cliente, MenuItem
from django import forms
from django.contrib.auth.models import Permission


class ClienteForm(forms.ModelForm):
    class Meta:
        model = Cliente
        fields = '__all__'

    # Sobrescreva o campo gestor para filtrar apenas os usuários com is_gerente=True
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['gestor'].queryset = User.objects.filter(is_gerente=True)


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    form = ClienteForm 
    list_display = ('nome', 'email', 'telefone', 'gestor') 
    search_fields = ('nome', 'email', 'telefone')
    list_filter = ('gestor',)
    ordering = ('nome',) 



class UserAdmin(UserAdmin):
    # Campos que serão exibidos na página de listagem do admin
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_vendedor', 'is_gerente', 'is_staff')
    
    # Campos que poderão ser pesquisados
    search_fields = ('email', 'username', 'first_name', 'last_name')
    
    # Filtros disponíveis na barra lateral do admin
    list_filter = ('is_vendedor', 'is_gerente', 'is_staff', 'is_superuser', 'is_active')
    
    # Configurações para a edição de detalhes do usuário
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Informações Pessoais', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_vendedor', 'is_gerente', 'groups', 'user_permissions')}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Campos que podem ser adicionados durante a criação de um novo usuário
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_vendedor', 'is_gerente', 'is_active')}
        ),
    )

admin.site.register(User, UserAdmin)
admin.site.register(MenuItem)
admin.site.register(Permission)