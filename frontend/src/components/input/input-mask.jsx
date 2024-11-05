import { InputMask as InputMaskPR } from 'primereact/inputmask'
import React, { forwardRef } from 'react'

const InputMask = forwardRef(
  (
    {
      iconClassName,
      label,
      type,
      value,
      mask,
      containerStyle,
      className,
      required,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={`p-inputgroup mt-5 ${containerStyle}`}>
        {iconClassName && (
          <span className="p-inputgroup-addon h-8">
            <i className={iconClassName}></i>
          </span>
        )}
        <span className="p-float-label h-8">
          <InputMaskPR
            value={value}
            mask={mask}
            type={type}
            id={label.toLowerCase()}
            required={required}
            className={`${className}`}
            ref={ref}
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

InputMask.displayName = 'InputMask'

export { InputMask }
