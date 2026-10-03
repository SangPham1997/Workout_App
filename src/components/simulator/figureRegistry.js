import {
  BicycleFigure,
  SupineFigure,
  ReverseFigure,
  PlankFigure,
  BirdDogFigure,
  DeadBugFigure,
  CatCowFigure,
  ClimberFigure,
  StandingFigure,
  SquatFigure,
  GluteBridgeFigure,
  SwanFigure,
  SwimmingFigure,
  SpineStretchFigure,
  RollDownFigure,
} from './SvgFigures';

export const figureRegistry = {
  // Nhóm bụng
  bicycle: BicycleFigure,
  supine: SupineFigure,
  reverse: ReverseFigure,
  plank: PlankFigure,

  // Nhóm lưng & cột sống (Pilates)
  swan: SwanFigure,
  swimming: SwimmingFigure,
  'spine-stretch': SpineStretchFigure,
  'roll-down': RollDownFigure,

  // Nhóm toàn thân
  birddog: BirdDogFigure,
  deadbug: DeadBugFigure,
  catcow: CatCowFigure,
  climber: ClimberFigure,
  standing: StandingFigure,
  squat: SquatFigure,
  'glute-bridge': GluteBridgeFigure,
};