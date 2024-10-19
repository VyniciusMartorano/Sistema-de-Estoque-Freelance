import { Calendar } from 'primereact/calendar'


export function InputCalendar({
  label,
  className,
  containerStyle,
  ...rest
}) {
  return (
    <div className={`p-inputgroup pt-6 ${containerStyle ?? ''}`}>
      <span className="p-float-label h-8 text-xs">
        <Calendar
          dateFormat="dd/mm/yy"
          showButtonBar
          locale="pt"
          className={`w-44 ${className ?? ''}`}
          showIcon
          {...rest}
        />
        <label>{label}</label>
      </span>
    </div>
  )
}
