import type { DifferenceRegion, GameState, Level, Point } from './types';

/** 关卡图片的宽高比（宽 : 高）。所有关卡图片统一为 4:3。 */
const IMAGE_ASPECT_RATIO = 4 / 3;

/**
 * 判断点是否落在差异点的圆形区域内（含边界）。
 * 相对坐标在纵向和横向上的物理长度不同，纵向差值需要先除以宽高比，
 * 才能和以图片宽度为单位的半径比较，使圆在屏幕上保持为圆。
 */
function isInsideRegion(point: Point, region: DifferenceRegion): boolean {
  const dx = point.x - region.center.x;
  const dy = (point.y - region.center.y) / IMAGE_ASPECT_RATIO;
  return dx * dx + dy * dy <= region.radius * region.radius;
}

/** 每关的限时（毫秒）。计时不可暂停。 */
const TIME_LIMIT_MS = 60_000;

export function getRemainingMs(state: GameState): number {
  return Math.max(0, TIME_LIMIT_MS - state.elapsedMs);
}

export function startLevel(level: Level): GameState {
  return {
    level,
    status: 'playing',
    foundIds: [],
    elapsedMs: 0,
    clearTimeMs: null,
  };
}

export function clickPoint(state: GameState, point: Point): GameState {
  if (state.status !== 'playing') {
    return state;
  }

  const region = state.level.differences.find(
    (difference) =>
      !state.foundIds.includes(difference.id) && isInsideRegion(point, difference),
  );
  if (!region) {
    return state;
  }

  const foundIds = [...state.foundIds, region.id];
  if (foundIds.length < state.level.differences.length) {
    return { ...state, foundIds };
  }

  return {
    ...state,
    foundIds,
    status: 'cleared',
    clearTimeMs: state.elapsedMs,
  };
}

export function advanceTime(state: GameState, deltaMs: number): GameState {
  if (state.status !== 'playing') {
    return state;
  }

  const elapsedMs = state.elapsedMs + deltaMs;
  if (elapsedMs >= TIME_LIMIT_MS) {
    return { ...state, elapsedMs: TIME_LIMIT_MS, status: 'timeUp' };
  }

  return { ...state, elapsedMs };
}

export function restartLevel(state: GameState): GameState {
  return startLevel(state.level);
}
