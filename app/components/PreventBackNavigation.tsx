import { JSX, useEffect, useState } from 'react';
import { useTimerStore } from '@/state/timerStore';
import Modal from '@/components/Modal';
import { useUserStore } from '@/state/userStore';

/**
 * Prevents the user from navigating back using the browser's back button or reloading the page
 * without confirmation. Displays a modal to confirm user action when such events are triggered.
 *
 * The component listens to browser history changes and prompts the user with a modal to confirm
 * either navigation away from the page or a page reload. Additionally, it resets the application's
 * timer state when navigation or unload occurs.
 *
 * @return {JSX.Element} A modal component that prompts users to confirm their navigation actions,
 * with options to either process or cancel the action.
 */
function PreventBackNavigation(): JSX.Element {
  const resetTimer = useTimerStore((state) => state.reset);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isReloadModal, setIsReloadModal] = useState(false);
  const logout = useUserStore((s) => s.logout);

  useEffect(() => {
    const onPopState = () => {
      setModalOpen(true);
      setIsReloadModal(false);
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    const handleUnload = () => {
      logout();
      resetTimer();
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', onPopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [logout, resetTimer]);

  const handleConfirm = () => {
    resetTimer();
    setModalOpen(false);
    setIsReloadModal(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setIsReloadModal(false);
    if (!isReloadModal) {
      window.history.pushState(null, '', window.location.href);
    }
  };

  return (
    <Modal
      title="Confirm action"
      content={
        isReloadModal
          ? 'Are you sure you want to reload the page? Your current progress will be lost.'
          : 'This will reset your progress and return you to the instructions page. Are you sure you want to proceed?.'
      }
      isOpen={isModalOpen}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
}

export default PreventBackNavigation;
