export class Helpers {
  /**
   * Adiciona navegação SPA aos itens de menu
   *
   * Ps.: não usar o atributo 'url' do objeto MenuItem, pois o mesmo é um href que atualiza a página para navegar.
   */
  static addNavigateToMenuItens(menus, navigate) {
    for (const item of menus) {
      if (item.to) {
        item.command = () => navigate(item.to)
      }

      if (item.items) {
        this.addNavigateToMenuItens(item.items, (url) => navigate(url))
      }
    }

    return menus
  }

  static isMobileDevice() {
    return navigator.userAgent.matchAll(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i
    )
  }
}
