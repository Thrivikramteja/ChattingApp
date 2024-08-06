import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import Classes from "./Modal.module.css";

function SignUpModal({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const closeModal = () => {
    setIsOpen(false);
    navigate('/');
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

export default SignUpModal;
