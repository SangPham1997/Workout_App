import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      duration={3500}
      visibleToasts={4}
      expand={false}
      gap={12}
      offset={16}
      swipeDirections={['right']}
      toastOptions={{
        className: 'font-sans',
        style: {
          background: '#1e293b',
          color: '#e2e8f0',
          border: '1px solid #334155',
        },
      }}
    />
  );
}