import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';

const SportsIcon = ({ sportsId }) => {
  switch (sportsId) {
    case '62e14b643b17ae7b977921e8':
      return <SportsBasketballIcon />;

    case '62e14b553b17ae7b977921e7':
      return <SportsBaseballIcon />;

    default:
      return <SportsVolleyballIcon />;
  }
};

export default SportsIcon;
