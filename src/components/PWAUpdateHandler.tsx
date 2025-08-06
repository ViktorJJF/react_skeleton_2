import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useToast } from '@/hooks/ui/use-toast';
import { Button } from '@/components/ui/button';

export const PWAUpdateHandler = () => {
  const { toast } = useToast();
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Service Worker registered:', r);
    },
    onRegisterError(error) {
      console.log('Service Worker registration error:', error);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      toast({
        title: 'App is ready for offline use',
        description: 'You can now use the app without an internet connection.',
      });
      setOfflineReady(false);
    }
  }, [offlineReady, setOfflineReady, toast]);

  useEffect(() => {
    if (needRefresh) {
      toast({
        title: 'Update available',
        description: 'A new version of the app is available. Reload to update.',
        action: (
          <Button
            variant="outline"
            onClick={() => {
              updateServiceWorker(true);
              setNeedRefresh(false);
            }}
          >
            Reload
          </Button>
        ),
        duration: Infinity,
      });
    }
  }, [needRefresh, setNeedRefresh, updateServiceWorker, toast]);

  return null;
}; 