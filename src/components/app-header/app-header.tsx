import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserSelector } from '@slices';

export const AppHeader: FC = () => {
  //Для отображения имени в профиле
  const userName = useSelector(getUserSelector)?.name;
  return <AppHeaderUI userName={userName} />;
};
