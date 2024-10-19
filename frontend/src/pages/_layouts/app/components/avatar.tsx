import { MenuItem } from 'primereact/menuitem'
import { TieredMenu } from 'primereact/tieredmenu'
import { useContext, useRef } from 'react'

import defaultUserAvatarFemale from '@/assets/default_user_female.png'
import defaultUserAvatarMale from '@/assets/default_user_male2.png'
import { AuthContext } from '@/context/AuthContext'

interface AvatarProps {
  isMale: boolean
  userName: string
}

export function SGCAvatar({ isMale, userName }: AvatarProps) {
  const menu = useRef<TieredMenu>(null)

  const { signOut } = useContext(AuthContext)

  const handleSignOut = () => {
    signOut()
  }

  const items: MenuItem[] = [
    {
      label: 'Sair',
      icon: 'pi pi-power-off',
      command: () => handleSignOut(),
    },
  ]
  return (
    <div className="flex flex-col" onClick={(e) => menu.current?.toggle(e)}>
      <div className="flex h-full cursor-pointer flex-row items-center gap-2">
        <div className="rounded-full ">
          <img
            src={isMale ? defaultUserAvatarMale : defaultUserAvatarFemale}
            alt=""
            className="border-1 size-10 rounded-full p-1"
          />
        </div>

        <p className="text-white">{userName}</p>
      </div>
      <div className="">
        <TieredMenu model={items} popup ref={menu} breakpoint="767px" />
      </div>
    </div>
  )
}
