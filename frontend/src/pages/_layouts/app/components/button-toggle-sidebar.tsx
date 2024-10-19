import { HTMLProps } from 'react'

interface ButtonToggleSidebarProps extends HTMLProps<HTMLButtonElement> {
  handleOpenSidebar: () => void
}

export function ButtonToggleSidebar({
  handleOpenSidebar,
}: ButtonToggleSidebarProps) {
  return (
    <div
      onClick={handleOpenSidebar}
      className={`delay-50 cursor-pointer text-white transition duration-100 ease-in-out`}
      style={{
        transition: 'marginLeft 0.5s ease-in-out',
        outline: 'none',
      }}
    >
      <i className="pi pi-bars cursor-pointer text-white hover:text-simas-gray-light"></i>
    </div>
  )
}
