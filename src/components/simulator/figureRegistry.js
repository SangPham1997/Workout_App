// Registry tra hình SVG theo key `svg` trong data/exercises.js
import {
  BicycleFigure, SupineFigure, ReverseFigure, PlankFigure, BirdDogFigure,
  DeadBugFigure, CatCowFigure, ClimberFigure, StandingFigure, SquatFigure,
  GluteBridgeFigure,
} from './SvgFigures';

export const figureRegistry = {
  bicycle: BicycleFigure,
  supine: SupineFigure,
  reverse: ReverseFigure,
  plank: PlankFigure,
  birddog: BirdDogFigure,
  deadbug: DeadBugFigure,
  catcow: CatCowFigure,
  climber: ClimberFigure,
  standing: StandingFigure,
  squat: SquatFigure,
  'glute-bridge': GluteBridgeFigure,
};
