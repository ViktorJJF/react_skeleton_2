import { useState, useCallback } from "react";

interface UseModalOptions {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

/**
 * Generic modal state management hook
 */
export const useModal = (options: UseModalOptions = {}) => {
  const { defaultOpen = false, onOpen, onClose } = options;

  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
};

/**
 * Hook for managing multiple modal states
 */
export const useModals = <T extends Record<string, boolean>>(
  initialState: T
) => {
  const [modals, setModals] = useState(initialState);

  const openModal = useCallback((modalName: keyof T) => {
    setModals((prev) => ({
      ...prev,
      [modalName]: true,
    }));
  }, []);

  const closeModal = useCallback((modalName: keyof T) => {
    setModals((prev) => ({
      ...prev,
      [modalName]: false,
    }));
  }, []);

  const toggleModal = useCallback((modalName: keyof T) => {
    setModals((prev) => ({
      ...prev,
      [modalName]: !prev[modalName],
    }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals((prev) =>
      Object.keys(prev).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false,
        }),
        {} as T
      )
    );
  }, []);

  return {
    modals,
    openModal,
    closeModal,
    toggleModal,
    closeAllModals,
    setModals,
  };
};
