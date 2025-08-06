import { useEffect } from "react";
import config from "@/config";
import { useNotifications } from "@/hooks/ui/useNotifications";

const CHECK_INTERVAL = 1000 * 60 * 5; // Check every 5 minutes

export const useVersionCheck = () => {
  const { sendBanner } = useNotifications();

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const response = await fetch("/version.json?t=" + new Date().getTime());
        if (!response.ok) {
          throw new Error("Could not fetch version data");
        }
        const data = await response.json();
        const latestVersion = data.version;
        const currentVersion = config.APP_VERSION;

        if (
          latestVersion &&
          currentVersion &&
          latestVersion !== currentVersion
        ) {
          sendBanner({
            type: "info",
            message: `A new version (${latestVersion}) is available. Please refresh the page to update.`,
          });
        }
      } catch (error) {
        console.error("Failed to check for version updates:", error);
      }
    };

    // Check immediately on mount, then set an interval
    checkForUpdates();
    const intervalId = setInterval(checkForUpdates, CHECK_INTERVAL);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [sendBanner]);
};
