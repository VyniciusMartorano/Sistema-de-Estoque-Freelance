import { Checkbox, CheckboxProps } from 'primereact/checkbox'

export function InputCheckbox({ label, ...rest }) {
  return (
    <div className="card flex justify-center">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center">
          <Checkbox inputId={label} {...rest} />
          <label htmlFor={label} className="ml-2">
            {label}
          </label>
        </div>
      </div>
    </div>
  )
}
