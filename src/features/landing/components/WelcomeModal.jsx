import { useState, useEffect } from "react";
import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import useContent from "../../../shared/hooks/useContent";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const { content } = useContent("landing.welcome");

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenWelcomeModal");
    if (!hasSeen) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenWelcomeModal", "true");
    setOpen(false);
  };

  const footer = (
    <Button onClick={handleClose} variant="primary">
      {content.cta_text}
    </Button>
  );

  if (!open) return null;

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
