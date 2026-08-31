import { useEffect } from "react";

import {
  listenForForegroundMessages,
} from "../../services/notification.service";

export const useForegroundNotifications = (onNotification) => {
  useEffect(() => {
    const unsubscribe =
      listenForForegroundMessages(onNotification);

    return () => {
      unsubscribe();
    };
  }, [onNotification]);
};