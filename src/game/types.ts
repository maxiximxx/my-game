/** 相对图片的坐标，取值范围 0 到 1，原点在图片左上角。 */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/**
 * 差异点的圆形区域。
 * 圆心为相对图片的坐标；半径以图片宽度为单位（相对值）。
 */
export interface DifferenceRegion {
  readonly id: string;
  readonly center: Point;
  readonly radius: number;
}

/** 关卡数据：一组原图、改图和它们的差异点。规则代码不依赖具体关卡。 */
export interface Level {
  readonly id: number;
  readonly originalImage: string;
  readonly modifiedImage: string;
  readonly differences: readonly DifferenceRegion[];
}

export type GameStatus = 'playing' | 'cleared' | 'timeUp';

export interface GameState {
  readonly level: Level;
  readonly status: GameStatus;
  /** 已找到的差异点 id，按找到的先后排列。 */
  readonly foundIds: readonly string[];
  /** 本关从开始到现在经过的毫秒数，由外部通过 advanceTime 推进。 */
  readonly elapsedMs: number;
  /** 通关时的用时（毫秒）；未通关时为 null。 */
  readonly clearTimeMs: number | null;
}
