import ComponentsLayout from '../components/Layout';
import ComponentsScoreboard from '../components/Scoreboard';
import ContainersBet from '../containers/Bet';
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
    score: Math.floor(Math.random() * 100),
  }));

  const bet = {
    teams,
    odds: 0.2,
  };

  return (
    <ComponentsLayout>
      <ComponentsScoreboard scores={scores} />
      <ContainersBet bet={bet} />
    </ComponentsLayout>
  );
};

export default Home;
