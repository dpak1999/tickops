"use client";

import ResponsiveModal from "@/components/responsiveModal";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import CreateTaskFormWrapper from "./CreateTaskFormWrapper";

const CreateTaskModal = () => {
  const { isOpen, setIsOpen, close } = useCreateTaskModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
};

export default CreateTaskModal;
