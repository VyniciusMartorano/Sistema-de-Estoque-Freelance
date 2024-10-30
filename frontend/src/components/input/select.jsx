import { Dropdown } from 'primereact/dropdown'
import React from 'react'

const Select = React.forwardRef(
  ({ iconClassName, label, className, ...rest }, ref) => {
    return (
      <div className={`p-field ${className} mt-2 sm:mt-0`}>
        <div className="p-inputgroup">
          {iconClassName && (
            <span className="p-inputgroup-addon">
              <i className={iconClassName}></i>
            </span>
          )}
          <span className="p-float-label h-8">
            <Dropdown
              ref={ref}
              showClear
              emptyFilterMessage="Sem resultados..."
              emptyMessage="Sem resultados..."
              className="border-1 w-full rounded-md"
              {...rest}
            />
            <label className="text-xs">{label}</label>
          </span>
        </div>
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
