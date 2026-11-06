import type { DifferenceRegion, GameState, Level, Point } from './types';

/** 关卡图片的宽高比（宽 : 高）。所有关卡图片统一为 4:3。 */
const IMAGE_ASPECT_RATIO = 4 / 3;

/** 每关的限时（毫秒）。计时不可暂停。 */
const TIME_LIMIT_MS = 60_000;

/** 误点扣减的时间（毫秒）。 */
const MISS_PENALTY_MS = 5_000;

/** 误点叉号显示的时长（毫秒）。 */
const MISS_MARK_DURATION_MS = 600;

/** 每关可用的提示次数。 */
const HINTS_PER_LEVEL = 1;

/** 使用提示扣减的时间（毫秒）。 */
const HINT_PENALTY_MS = 10_000;

/** 提示高亮显示的时长（毫秒）。 */
const HINT_DURATION_MS = 2_000;

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

/** 推进本关用时；剩余时间归零时判定超时。 */
function passTime(state: GameState, deltaMs: number): GameState {
  const elapsedMs = state.elapsedMs + deltaMs;
  if (elapsedMs >= TIME_LIMIT_MS) {
    return { ...state, elapsedMs: TIME_LIMIT_MS, status: 'timeUp' };
  }

  return { ...state, elapsedMs };
}

function recordHit(state: GameState, regionId: string): GameState {
  const foundIds = [...state.foundIds, regionId];
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

function recordMiss(state: GameState, point: Point): GameState {
  const penalized = passTime(state, MISS_PENALTY_MS);
  const mark = { id: state.missCount, point, shownAtMs: penalized.elapsedMs };

  return {
    ...penalized,
    missCount: state.missCount + 1,
    missMarks: [...state.missMarks, mark],
  };
}

/** 去掉已经过了显示时长的误点叉号和提示。 */
function expireMarks(state: GameState): Pick<GameState, 'missMarks' | 'activeHint'> {
  const ageOf = (shownAtMs: number) => state.elapsedMs - shownAtMs;

  return {
    missMarks: state.missMarks.filter((mark) => ageOf(mark.shownAtMs) < MISS_MARK_DURATION_MS),
    activeHint:
      state.activeHint && ageOf(state.activeHint.shownAtMs) < HINT_DURATION_MS
        ? state.activeHint
        : null,
  };
}

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
    missCount: 0,
    missMarks: [],
    hintsLeft: HINTS_PER_LEVEL,
    activeHint: null,
  };
}

export function clickPoint(state: GameState, point: Point): GameState {
  if (state.status !== 'playing') {
    return state;
  }

  const containing = state.level.differences.filter((difference) =>
    isInsideRegion(point, difference),
  );
  if (containing.length === 0) {
    return recordMiss(state, point);
  }

  const unfound = containing.find((difference) => !state.foundIds.includes(difference.id));
  if (!unfound) {
    // 重复点击已找到的差异点：没有任何效果。
    return state;
  }

  return recordHit(state, unfound.id);
}

/** 使用提示：扣减 10 秒，高亮第一处尚未找到的差异点。次数用完后没有效果。 */
export function requestHint(state: GameState): GameState {
  if (state.status !== 'playing' || state.hintsLeft === 0) {
    return state;
  }

  const target = state.level.differences.find(
    (difference) => !state.foundIds.includes(difference.id),
  );
  if (!target) {
    return state;
  }

  const penalized = passTime(state, HINT_PENALTY_MS);
  return {
    ...penalized,
    hintsLeft: state.hintsLeft - 1,
    activeHint: { regionId: target.id, shownAtMs: penalized.elapsedMs },
  };
}

export function advanceTime(state: GameState, deltaMs: number): GameState {
  if (state.status !== 'playing') {
    return state;
  }

  const next = passTime(state, deltaMs);
  return { ...next, ...expireMarks(next) };
}

export function restartLevel(state: GameState): GameState {
  return startLevel(state.level);
}
