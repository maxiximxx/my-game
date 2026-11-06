import type { MouseEvent } from 'react';
import type { DifferenceRegion, Level, MissMark, Point } from './types';

interface GameBoardProps {
  level: Level;
  foundIds: readonly string[];
  missMarks: readonly MissMark[];
  onPick: (point: Point) => void;
}

export function GameBoard({ level, foundIds, missMarks, onPick }: GameBoardProps) {
  const foundRegions = level.differences.filter((difference) =>
    foundIds.includes(difference.id),
  );

  return (
    <div className="game-board">
      <BoardImage
        src={level.originalImage}
        alt="原图"
        markedRegions={foundRegions}
        missMarks={missMarks}
        onPick={onPick}
      />
      <BoardImage
        src={level.modifiedImage}
        alt="改图"
        markedRegions={foundRegions}
        missMarks={missMarks}
        onPick={onPick}
      />
    </div>
  );
}

interface BoardImageProps {
  src: string;
  alt: string;
  markedRegions: readonly DifferenceRegion[];
  missMarks: readonly MissMark[];
  onPick: (point: Point) => void;
}

function BoardImage({ src, alt, markedRegions, missMarks, onPick }: BoardImageProps) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onPick({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    });
  };

  return (
    <div className="board-image" onClick={handleClick}>
      <img src={src} alt={alt} draggable={false} />
      {markedRegions.map((region) => (
        <span
          key={region.id}
          className="marker"
          style={{
            left: `${region.center.x * 100}%`,
            top: `${region.center.y * 100}%`,
            // 直径为半径的两倍，图片宽度按 100% 计算。
            width: `${region.radius * 2 * 100}%`,
          }}
        />
      ))}
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
