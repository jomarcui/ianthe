import { ReactNode } from 'react';
import { Box } from '@mui/material';

type TabPanelProps = {
  children: ReactNode;
  index: number;
  value: number;
};

const TabPanel = ({ children, index, value, ...other }: TabPanelProps) => (
  <div
    aria-labelledby={`full-width-tab-${index}`}
    id={`full-width-tabpanel-${index}`}
    hidden={value !== index}
    role="tabpanel"
    {...other}
  >
    {value === index && <Box>{children}</Box>}
  </div>
);

export default TabPanel;
