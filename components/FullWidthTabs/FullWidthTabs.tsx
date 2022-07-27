import React from 'react';
import { AppBar, Box, Tabs, Tab } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Tab {
  header: {
    key: number;
    label: string;
  };
  body: React.ReactNode;
}

interface FullWidthTabsProps<T> {
  tabs: Tab[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const a11yProps = (index: number) => ({
  id: `full-width-tab-${index}`,
  'aria-controls': `full-width-tabpanel-${index}`,
});

const FullWidthTabs = <T,>(props: FullWidthTabsProps<T>) => {
  const theme = useTheme();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs
        aria-label="full width tabs"
        indicatorColor="secondary"
        onChange={handleChange}
        sx={{ bgcolor: '#1976d2', color: '#fff' }}
        textColor="inherit"
        value={value}
        variant="fullWidth"
      >
        {props.tabs.map(({ header: { key, label } }) => (
          <Tab key={key} label={label} {...a11yProps(key)} />
        ))}
      </Tabs>
      {props.tabs.map(({ header: { key }, body }) => (
        <TabPanel index={key} key={key} dir={theme.direction} value={value}>
          {body}
        </TabPanel>
      ))}
    </Box>
  );
};

const TabPanel = ({ children, index, value, ...other }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`full-width-tabpanel-${index}`}
    aria-labelledby={`full-width-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box>
        {children}
      </Box>
    )}
  </div>
);

export default FullWidthTabs;
