import { useState } from "react";
import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import useContent from "../../../shared/hooks/useContent";

export default function WelcomeModal() {
  const [open, setOpen] = useState(true);
  const { content } = useContent("landing.welcome");

  const footer = (
    <Button onClick={() => setOpen(false)}>{content.cta_text}</Button>
  );

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
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
