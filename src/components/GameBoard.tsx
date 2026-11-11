import type { CSSProperties, MouseEvent } from 'react';
import { locateClick } from '../domain/hitArea';
import { MOBILE_LAYOUT_QUERY } from '../domain/layout';
import type { DifferenceRegion, Level, MissMark, Point } from '../domain/types';

type PickHandler = (point: Point, minHitRadius: number) => void;

interface GameBoardProps {
  level: Level;
  foundIds: readonly string[];
  missMarks: readonly MissMark[];
  hintRegion: DifferenceRegion | null;
  onPick: PickHandler;
}

export function GameBoard({ level, foundIds, missMarks, hintRegion, onPick }: GameBoardProps) {
  const foundRegions = level.differences.filter((difference) =>
    foundIds.includes(difference.id),
  );

  return (
    <div className="game-board">
      <BoardImage
        src={level.originalImage}
        alt="原图"
        label="原图"
        markedRegions={foundRegions}
        missMarks={missMarks}
        hintRegion={null}
        onPick={onPick}
      />
      <BoardImage
        src={level.modifiedImage}
        alt="改图"
        label="改图"
        markedRegions={foundRegions}
        missMarks={missMarks}
        hintRegion={hintRegion}
        onPick={onPick}
      />
    </div>
  );
}

/** 圆形区域在图片上的位置和大小。直径为半径的两倍，图片宽度按 100% 计算。 */
function regionStyle(region: DifferenceRegion): CSSProperties {
  return {
    left: `${region.center.x * 100}%`,
    top: `${region.center.y * 100}%`,
    width: `${region.radius * 2 * 100}%`,
  };
}

interface BoardImageProps {
  src: string;
  alt: string;
  label: string;
  markedRegions: readonly DifferenceRegion[];
  missMarks: readonly MissMark[];
  hintRegion: DifferenceRegion | null;
  onPick: PickHandler;
}

function BoardImage({
  src,
  alt,
  label,
  markedRegions,
  missMarks,
  hintRegion,
  onPick,
}: BoardImageProps) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mobileLayout = window.matchMedia(MOBILE_LAYOUT_QUERY).matches;
    const { point, minHitRadius } = locateClick(event.clientX, event.clientY, rect, mobileLayout);
    onPick(point, minHitRadius);
  };

  return (
    <div className="board-image" onClick={handleClick}>
      <img src={src} alt={alt} draggable={false} />
      <span className="board-tag" aria-hidden="true">
        {label}
      </span>
      {markedRegions.map((region) => (
        <span key={region.id} className="region-ring marker" style={regionStyle(region)} />
      ))}
      {hintRegion && (
        <span className="region-ring hint-ring" style={regionStyle(hintRegion)} />
      )}
      {missMarks.map((mark) => (
        <span
          key={mark.id}
          className="miss-mark"
          style={{
            left: `${mark.point.x * 100}%`,
            top: `${mark.point.y * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
