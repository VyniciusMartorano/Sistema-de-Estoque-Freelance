import './index.css'

import { BreadCrumb } from 'primereact/breadcrumb'
import { Link } from 'react-router-dom'

export function Screen({ itens, children }) {
  const model = itens.map((item, index) => ({
    label: item.label,
    template: () => (
      <Link to={item.link}>
        <span>{item.label}</span>
      </Link>
    ),
    className:
      index === itens.length - 1
        ? 'font-bold link-nav-custom'
        : 'link-nav-custom',
  }))

  const home = {
    icon: 'pi pi-home',
    template: () => (
      <Link to={'/'}>
        <i className="pi pi-home icon-home-custom"></i>
      </Link>
    ),
  }

  return (
    <>
      <BreadCrumb model={model} home={home} className="mb-2" />

      {children}
    </>
  )
}
