"use client";

import ResponsiveModal from "@/components/responsiveModal";
import CreateProjectForm from "./CreateProjectForm";
import { useCreateProjectModal } from "../hooks/use-create-project-modal";

const CreateProjectModal = () => {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};

export default CreateProjectModal;
