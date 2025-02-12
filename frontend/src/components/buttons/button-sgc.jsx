import { Button } from 'primereact/button'

export function ButtonSGC({
  icon,
  label = '',
  className = '',
  bgColor,
  ref,
  children,
  ...rest
}) {
  return (
    <Button
      ref={ref}
      size="small"
      className={`flex h-3 gap-1 border-none  p-3 hover:brightness-90 ${bgColor ? 'bg-' + bgColor : ''} ${className}`}
      label={label}
      icon={icon}
      {...rest}
    >
      {!label && children}
    </Button>
  )
}
