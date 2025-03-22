import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { moveIngredient, removeIngredient } from '@slices';
import { Direction } from '../../utils/constants';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    /* Перемещение, удаление ингредиентов в конструкторе */

    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(moveIngredient({ index, direction: Direction.Down }));
    };
    const handleMoveUp = () => {
      dispatch(moveIngredient({ index, direction: Direction.Up }));
    };

    const handleClose = () => {
      dispatch(removeIngredient(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
