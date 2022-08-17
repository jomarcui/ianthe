import { NextPage } from 'next';
import ComponentsLayout from '../../components/Layout';
import ContainersSchedules from '../../containers/Schedules';

const Schedules: NextPage = () => {
  return (
    <ComponentsLayout>
      <ContainersSchedules />
    </ComponentsLayout>
  );
};

export default Schedules;
