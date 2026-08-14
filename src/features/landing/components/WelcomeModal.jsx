import { useState, useEffect } from "react";
import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import useContent from "../../../shared/hooks/useContent";

const WELCOME_MODAL_KEY = "los-sims-welcome-seen";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const { content } = useContent("landing.welcome");

  useEffect(() => {
    const alreadySeen = localStorage.getItem(WELCOME_MODAL_KEY);
    if (!alreadySeen) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(WELCOME_MODAL_KEY, "true");
  };

  const footer = (
    <Button onClick={handleClose}>{content.cta_text}</Button>
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeOnBackdrop={false}
      size="lg"
      closeAriaLabel={content.close_aria}
    >
      <div className="flex justify-center mb-5">
        <img src="/sims-icon.png" alt="" className="w-20 h-20 object-contain" />
      </div>

      <h2 className="text-2xl font-extrabold mb-3 tracking-tight text-text-main text-center">
        {content.title}
      </h2>

      <p className="text-text-sub mb-8 leading-relaxed text-sm md:text-base text-center">
        {content.subtitle}
      </p>

      <div className="flex justify-center">{footer}</div>
    </Modal>
  );
}
