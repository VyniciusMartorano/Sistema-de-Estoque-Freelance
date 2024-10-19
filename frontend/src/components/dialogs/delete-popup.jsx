import { ConfirmPopup } from 'primereact/confirmpopup'
import { useRef, useState } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'

import { IconButton } from '../buttons'



export function DeletePopup({ onAccept, onReject, feedbackMessage, itemLabel }) {
  const [visible, setVisible] = useState(false)
  const buttonEl = useRef(null)

  return (
    <>
      <ConfirmPopup
        target={buttonEl.current}
        visible={visible}
        onHide={() => setVisible(false)}
        message={
          <div className="border-b-1 flex w-full flex-col items-center gap-3">
            <i className="pi pi-exclamation-circle text-simas-red-primary"></i>
            <div className="flex flex-col gap-2">
              <span className="text-center text-lg">{feedbackMessage ?? 'Deseja realmente apagar o item'}</span>
              <span className="text-center text-lg">
                <b>{itemLabel?.toLocaleUpperCase() ?? 'Item padrão'}</b>?
              </span>
            </div>
          </div>
        }
        accept={onAccept}
        reject={onReject}
        acceptLabel="Sim"
        acceptIcon="pi pi-check"
        acceptClassName="bg-simas-green-primary p-button-success border-none"
        rejectLabel="Não"
        rejectIcon="pi pi-times"
        rejectClassName="bg-simas-red-primary p-button-danger mr-4 border-none"
      />

      <div ref={buttonEl}>
        <IconButton
          iconComponent={<FaRegTrashAlt size={18} />}
          className="bg-simas-red-primary p-1"
          type="button"
          containerHeight="h-6"
          tooltip="Remover"
          onClick={() => setVisible(true)}
        />
      </div>
    </>
  )
}
