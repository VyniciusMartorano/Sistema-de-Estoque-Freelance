import logoSimas from '@/assets/logo.png'

export function HeaderSidebar() {
  return (
    <div className="flex h-10 w-full items-center justify-center ">
      <img src={logoSimas} alt="Logo Simas Industrial" className="w-20" />
      {/* {visible && (
        <p className="text-xl text-simas-gray-primary transition-all delay-1000 duration-1000 ease-in-out">
          SGC
        </p>
      )} */}
    </div>
  )
}
