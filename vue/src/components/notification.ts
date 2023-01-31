import { ElNotification } from 'element-plus';

export const info = (args: { title: string; message: string }): void => {
  ElNotification({
    title: args.title,
    message: args.message,
    type: 'info',
  });
};

export const error = (args: { title: string; message: string }): void => {
  ElNotification({
    title: args.title,
    message: args.message,
    type: 'error',
  });
};

export const success = (args: { title: string; message: string }): void => {
  ElNotification({
    title: args.title,
    message: args.message,
    type: 'success',
  });
};
