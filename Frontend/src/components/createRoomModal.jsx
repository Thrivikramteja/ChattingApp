import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Classes from "./Modal.module.css";

function CreateRoomModal({ children }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const closeModal = () => {
    setIsOpen(false);
    navigate('/chats');
  };

  return isOpen ? (
    <>
      <div className={Classes.backdrop} onClick={closeModal} />
      <dialog open className={Classes.modal}>
        {children}
      </dialog>
    </>
  ) : null;
}

export default CreateRoomModal;
