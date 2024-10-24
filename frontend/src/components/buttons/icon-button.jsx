import { Button } from 'primereact/button'

export function IconButton({
  icon,
  className,
  iconComponent,
  containerHeight,
  withoutBorder = true,
  loading,
  ...props
}) {
  return (
    <Button
      className={`${withoutBorder && 'border-none'} p-2 ${className ?? ''} ${containerHeight ?? 'h-8'} flex items-center justify-center`}
      loading={loading}
      tooltipOptions={{
        position: 'top',
        className: 'text-xs',
      }}
      {...props}
    >
      {icon && !iconComponent && !loading && <i className={`pi ${icon}`}></i>}
      {iconComponent && <>{iconComponent}</>}
    </Button>
  )
}
