import { levels } from './levels';

interface HomePageProps {
  onStart: () => void;
}

// 首页右侧展示第 1 关：改图上用绿圈标出新增的那朵花，示意"找到差异"的效果。
const previewLevel = levels[0];
const previewRegion = previewLevel.differences.find((difference) => difference.id === 'flower');

export function HomePage({ onStart }: HomePageProps) {
  return (
    <main className="home">
      <section>
        <h1 className="home-title">
          <svg className="ring-mark" viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r="16" fill="none" stroke="#1d2b4f" strokeWidth="11" />
            <circle cx="24" cy="24" r="16" fill="none" stroke="#2fb874" strokeWidth="5" />
          </svg>
          大家来找茬
        </h1>
        <p className="lead">
          两张图，五处不同。
          <br />
          60 秒内找齐，误点扣 5 秒，提示扣 10 秒。
        </p>
        <button type="button" className="btn btn-primary btn-large" onClick={onStart}>
          开始游戏
        </button>
      </section>

      <div className="home-visual" aria-hidden="true">
        <div className="home-frame">
          <img src={previewLevel.originalImage} alt="" />
        </div>
        <div className="home-frame">
          <img src={previewLevel.modifiedImage} alt="" />
          {previewRegion && (
            <span
              className="region-ring marker"
              style={{
                left: `${previewRegion.center.x * 100}%`,
                top: `${previewRegion.center.y * 100}%`,
                width: `${previewRegion.radius * 2 * 100}%`,
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
