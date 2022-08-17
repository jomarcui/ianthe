import { Breadcrumbs, Link as MUILink, Typography } from '@mui/material';
import { NextPage } from 'next';
import Link from 'next/link';
import ComponentsLayout from '../../components/Layout';
import ContainersSchedules from '../../containers/Schedules';

const Schedules: NextPage = () => (
  <ComponentsLayout>
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{ bgcolor: '#fff', borderBottom: '1px solid #ecf0f1', p: 2 }}
    >
      <Link href="/" passHref>
        <MUILink color="inherit" underline="hover">
          Home
        </MUILink>
      </Link>
      <Typography color="text.primary">Schedules</Typography>
    </Breadcrumbs>
    <ContainersSchedules />
  </ComponentsLayout>
);

export default Schedules;
