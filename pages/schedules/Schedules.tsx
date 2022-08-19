import { Breadcrumbs, Link as MUILink, Typography } from '@mui/material';
import { NextPage } from 'next';
import Link from 'next/link';
import ComponentsLayout from '../../components/Layout';
import ContainersSchedules from '../../containers/Schedules';

const Schedules: NextPage = () => (
  <ComponentsLayout>
    <ContainersSchedules />
  </ComponentsLayout>
);

export default Schedules;
