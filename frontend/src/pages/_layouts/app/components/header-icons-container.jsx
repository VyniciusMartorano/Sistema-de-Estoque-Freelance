function CircleIcon({ iconName }) {
  return (
    <div className="p-4 ">
      <i className={`pi pi-${iconName} text-white`}></i>
    </div>
  )
}

export function HeaderIconsContainer() {
  return (
    <div className="flex flex-row gap-4 ">
      <CircleIcon iconName="bell" />
      <CircleIcon iconName="envelope" />
    </div>
  )
}
