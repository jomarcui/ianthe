import {
  Dispatch,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { Box, Tabs, Tab } from '@mui/material';

interface FullWidthTabsProps {
  setValue: Dispatch<SetStateAction<number>>;
  tabs: Tab[];
  value: number;
}

interface Tab {
  header: {
    key: string;
    label: string;
  };
  icon: string | ReactElement<any, string | JSXElementConstructor<any>>;
}

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const a11yProps = (index: string) => ({
  id: `full-width-tab-${index}`,
  'aria-controls': `full-width-tabpanel-${index}`,
});

const FullWidthTabs = ({ setValue, tabs, value }: FullWidthTabsProps) => {
  useEffect(() => {
    // Fetch data from API
  }, [value]);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
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
        {tabs.map(({ header: { key, label }, icon }) => (
          <Tab icon={icon} key={key} label={label} {...a11yProps(key)} />
        ))}
      </Tabs>
      {/* {props.tabs.map(({ header: { key }, body }) => (
        <TabPanel index={key} key={key} value={value}>
          {body}
        </TabPanel>
      ))} */}
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
