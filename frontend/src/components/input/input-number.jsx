import { InputNumber } from 'primereact/inputnumber'
import React from 'react'

const InputNum = React.forwardRef(
  (
    {
      iconClassName,
      label,
      value,
      containerStyle,
      className,
      required,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        className={`p-inputgroup text-xs ${containerStyle ?? ''} mt-5 sm:mt-0`}
      >
        {iconClassName && (
          <span className="p-inputgroup-addon h-8">
            <i className={iconClassName}></i>
          </span>
        )}
        <span className="p-float-label h-8">
          <InputNumber
            value={value}
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
InputNum.displayName = 'InputNumber'

export { InputNum }
