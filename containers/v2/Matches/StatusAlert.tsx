import { Alert } from '@mui/material';

type StatusAlertProps = {
  config: {
    description: string;
    severity: 'error' | 'info';
  };
};

const StatusAlert = ({ config }: StatusAlertProps) => {
  if (!config) return null;

  const { description, severity } = config;

  return (
    <Alert severity={severity} variant="filled">
      {description}
    </Alert>
  );
};

export default StatusAlert;
