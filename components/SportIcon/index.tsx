import {
  SportsBaseball as SportsBaseballIcon,
  SportsBasketball as SportsBasketballIcon,
  SportsVolleyball as SportsVolleyballIcon,
} from '@mui/icons-material';

type SportIconProps = {
  sportId: string;
};

const SportIcon = ({ sportId }: SportIconProps) => {
  switch (sportId) {
    case '62e14b643b17ae7b977921e8':
      return <SportsBasketballIcon fontSize="large" />;

    case '62e14b553b17ae7b977921e7':
      return <SportsBaseballIcon fontSize="large" />;

    default:
      return <SportsVolleyballIcon fontSize="large" />;
  }
};

export default SportIcon;
