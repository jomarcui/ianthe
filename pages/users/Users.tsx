import { Breadcrumbs, Link as MUILink, Typography } from '@mui/material';
import { NextPage } from 'next';
import Link from 'next/link';
import ComponentsLayout from '../../components/Layout';
import ContainersUsersList from '../../containers/Users/List';
// import ContainersUsersForm from '../../containers/Users/Form';

const Users: NextPage = () => {
  return (
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
        <Typography color="text.primary">Users</Typography>
      </Breadcrumbs>
      <ContainersUsersList />
      {/* <ContainersUsersForm /> */}
    </ComponentsLayout>
  );
};

export default Users;
