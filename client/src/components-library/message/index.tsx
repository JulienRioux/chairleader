import React, { useRef, useEffect, useState, ReactNode } from 'react';
import RCNotification from 'rc-notification';
import { NotificationInstance as RCNotificationInstance } from 'rc-notification/lib/Notification';
import { Styles } from 'styles';
import { Icon } from 'components-library/icon';
import { MessageWrapper, IconWrapper, TextWrapper } from './styled';
import { ThemeProvider } from 'hooks/theme';
import { BrowserRouter as Router } from 'react-router-dom';

let notificationInstance: RCNotificationInstance | null = null;

RCNotification.newInstance(
  {
    maxCount: 5,
    style: {
      position: 'fixed',
      left: '8px',
      top: '8px',
      transition: '2s',
      pointerEvents: 'none',

      zIndex: 9999999,
    },
  },
  (n) => {
    notificationInstance = n;
  }
);

const MessageComponent = ({
  time,
  children,
}: {
  time: number;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [messageHeight, setMessageHeight] = useState(0);

  useEffect(() => {
    setMessageHeight(ref.current?.offsetHeight ?? 0);
  }, []);

  return (
    <MessageWrapper time={time} ref={ref} height={messageHeight}>
      {children}
    </MessageWrapper>
  );
};

const sendMessage = (
  text: string,
  time = 3,
  type: 'info' | 'success' | 'error' | 'custom',
  icon: string | null = null
) => {
  // Change the appearence depending on the message type
  let messageIcon: string | null = icon;
  let iconColor = Styles.color.black;
  switch (type) {
    case 'success':
      messageIcon = 'check';
      iconColor = Styles.color.primary;
      break;
    case 'error':
      messageIcon = 'report';
      iconColor = Styles.color.danger;
      break;
    case 'info':
      messageIcon = 'info';
      iconColor = Styles.color.text;
      break;
    case 'custom':
      break;
    default:
      break;
  }

  const prefix = messageIcon ? (
    <IconWrapper style={{ color: iconColor }}>
      <Icon name={messageIcon} />
    </IconWrapper>
  ) : null;

  return (
    notificationInstance &&
    notificationInstance.notice({
      content: (
        <Router>
          <ThemeProvider>
            <MessageComponent time={time}>
              {prefix}
              <TextWrapper>{text}</TextWrapper>
            </MessageComponent>
          </ThemeProvider>
        </Router>
      ),
      duration: time,
    })
  );
};

export class message {
  static success(text: string, time?: number) {
    return sendMessage(text, time, 'success');
  }

  static error(text = 'Something went wrong...', time?: number) {
    return sendMessage(text, time, 'error');
  }

  static info(text: string, time?: number) {
    return sendMessage(text, time, 'info');
  }

  static customIcon(text: string, time?: number, icon?: string) {
    return sendMessage(text, time, 'custom', icon);
  }
}
