export function ButtonToggleSidebar({ handleOpenSidebar }) {
  return (
    <div
      onClick={handleOpenSidebar}
      className={`delay-50 cursor-pointer text-white transition duration-100 ease-in-out`}
      style={{
        transition: 'marginLeft 0.5s ease-in-out',
        outline: 'none',
      }}
    >
      <i className="pi pi-bars cursor-pointer text-white hover:text-sgc-gray-light"></i>
    </div>
  )
}
