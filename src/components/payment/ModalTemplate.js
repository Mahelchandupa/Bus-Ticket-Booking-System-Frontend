const ModalTemplate = ({children}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-55 p-4">
      {children}
    </div>
  )
}

export default ModalTemplate;
