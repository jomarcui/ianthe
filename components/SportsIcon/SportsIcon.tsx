import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import {
  Schedule as ScheduleIcon,
  Done as DoneIcon,
  LiveTv as LiveTvIcon,
} from '@mui/icons-material';
import { Status } from '../../enums';

type SportsIconProps = {
  sportId: string;
  status?: Status | undefined;
};

const SportsIcon = ({ sportId, status = undefined }: SportsIconProps) => {
  switch (status) {
    case Status.Ended:
      return <DoneIcon color="disabled" />;

    case Status.Live:
      return <LiveTvIcon color="error" />;

    case Status.Soon:
      return <ScheduleIcon color="info" />;

    default:
      break;
  }
  // const color = (() => {
  //   switch (status) {
  //     case Status.Ended:
  //       return 'disabled';

  //     case Status.Live:
  //       return 'success';

  //     case Status.Soon:
  //       return 'info';

  //     default:
  //       return 'inherit';
  //   }
  // })();

  // switch (sportId) {
  //   case '62e14b643b17ae7b977921e8':
  //     return <SportsBasketballIcon color={color} />;

  //   case '62e14b553b17ae7b977921e7':
  //     return <SportsBaseballIcon color={color} />;

  //   default:
  //     return <SportsVolleyballIcon color={color} />;
  // }
};

export default SportsIcon;
