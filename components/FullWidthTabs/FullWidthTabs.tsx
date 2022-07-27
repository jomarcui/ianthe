import React, { useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';

interface Tab {
  header: {
    key: number;
    label: string;
  };
  body: React.ReactNode;
}

interface FullWidthTabsProps{
  tabs: Tab[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const a11yProps = (index: number) => ({
  id: `full-width-tab-${index}`,
  'aria-controls': `full-width-tabpanel-${index}`,
});

const FullWidthTabs = (props: FullWidthTabsProps) => {
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    // Fetch data from API
  }, [value]);

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
        <TabPanel index={key} key={key} value={value}>
          {body}
        </TabPanel>
      ))}
    </Box>
  );
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

export default FullWidthTabs;
