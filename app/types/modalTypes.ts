export type ModalProps = {
  title: string;
  content: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};
