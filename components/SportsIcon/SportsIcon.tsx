import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import { Status } from '../../enums';

type SportsIconProps = {
  sportsId: string;
  status: Status | undefined;
};

const SportsIcon = ({ sportsId, status = undefined }) => {
  const color = (() => {
    switch (status) {
      case Status.Ended:
        return 'disabled';

      case Status.Live:
        return 'success';

      case Status.Soon:
        return 'info';

      default:
        return 'inherit';
    }
  })();

  switch (sportsId) {
    case '62e14b643b17ae7b977921e8':
      return <SportsBasketballIcon color={color} />;

    case '62e14b553b17ae7b977921e7':
      return <SportsBaseballIcon color={color} />;

    default:
      return <SportsVolleyballIcon color={color} />;
  }
};

export default SportsIcon;
