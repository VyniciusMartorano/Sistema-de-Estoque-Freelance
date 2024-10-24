import { InputText } from 'primereact/inputtext'
import React from 'react'

const Input = React.forwardRef(
  (
    {
      iconClassName,
      label,
      type,
      value,
      containerStyle,
      className,
      required,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={`p-inputgroup pt-6 text-xs ${containerStyle ?? ''}`}>
        {iconClassName && (
          <span className="p-inputgroup-addon h-8">
            <i className={iconClassName}></i>
          </span>
        )}
        <span className="p-float-label h-8">
          <InputText
            value={value}
            type={type}
            id={label.toLowerCase()}
            className={`p-inputtext-sm ${className ?? ''}`}
            ref={ref}
            required={required}
            {...rest}
          />
          <label>
            <span>{label}</span>
            <span className="text-red-500">{required && ' *'}</span>
          </label>
        </span>
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
