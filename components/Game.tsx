import { RouteProp } from '@react-navigation/native';
import type { GameStackParamList } from './Games';

export const GameDetailScreen = (props: any) => {
  const route = props.route as RouteProp<GameStackParamList, 'Game'>;
  const { component: Component } = route.params;
  return <Component />;
}

export default GameDetailScreen
