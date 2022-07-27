import React from 'react';
import { Box, AppBar, Tabs, Tab, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SwipeableViews from 'react-swipeable-views';

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
  console.log(props);
  const theme = useTheme();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {props.tabs.map(({ header: { key, label } }) => (
            <Tab key={key} label={label} {...a11yProps(key)} />
          ))}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {props.tabs.map(({ header: { key }, body }) => (
          <TabPanel index={key} key={key} dir={theme.direction} value={key}>
            {body}
          </TabPanel>
        ))}
      </SwipeableViews>
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
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
    )}
  </div>
);

export default FullWidthTabs;
