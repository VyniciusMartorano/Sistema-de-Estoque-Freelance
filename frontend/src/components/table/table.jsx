import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

const ITEMS_PER_PAGE = 15

const Empty = ({ emptyMsg }) => (
  <div className="text-center">
    <span className="text-sm font-bold uppercase">
      {emptyMsg ?? 'Nenhum registro encontrado'}
    </span>
  </div>
)

export function Table({
  rows,
  columns,
  selectable,
  allowExpansion,
  isLoading,
  lazy,
  emptyMsg,
  ...rest
}) {
  return (
    <DataTable
      lazy={lazy}
      stripedRows
      rows={rows ?? ITEMS_PER_PAGE}
      loading={isLoading}
      paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="({currentPage} de {totalPages})"
      emptyMessage={<Empty emptyMsg={emptyMsg} />}
      size="small"
      {...rest}
    >
      {selectable && (
        <Column
          selectionMode="multiple"
          style={{ padding: 0, width: '32px' }}
        />
      )}
      {allowExpansion && (
        <Column
          expander={(rowData) => {
            return rowData.items?.length > 0 ? rowData.items : []
          }}
          style={{ padding: 0, width: '32px' }}
        />
      )}

      {columns.map((column, index) => (
        <Column
          key={column.field + index}
          field={column.field}
          header={column.header}
          headerStyle={column.headerStyle}
          style={{ ...column.style, fontSize: '10px' }}
          className={`${column.className ?? ''}`}
          body={column.body}
          {...column}
        ></Column>
      ))}
    </DataTable>
  )
}
