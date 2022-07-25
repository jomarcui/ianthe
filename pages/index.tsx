import Layout from '../components/Layout';
import Scoreboard from '../components/Scoreboard';
import Bet from '../containers/Bet';
import { Team } from '../enums';

const Home = () => {
  const teams = [
    {
      name: 'Ipswich Town',
      nickname: 'The Blues',
      score: 4,
      src: '/ipswich_town_logo.svg',
      team: Team.Home,
    },
    {
      name: 'Sheriff Tiraspol',
      nickname: 'The Yellow-Blacks',
      score: 2,
      src: '/sheriff_tiraspol_logo.svg',
      team: Team.Visitor,
    },
  ];

  const scores = teams.map((team) => ({
    ...team,
    score: 4,
  }));

  const bet = {
    teams,
    odds: 0.2,
  };

  return (
    <Layout>
      <Scoreboard scores={scores} />
      <Bet bet={bet} />
    </Layout>
  );
};

export default Home;
