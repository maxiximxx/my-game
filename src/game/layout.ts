/** 关卡图片的宽高比（宽 : 高）。所有关卡图片统一为 4:3。styles.css 的 --image-ratio 必须与此一致。 */
export const IMAGE_ASPECT_RATIO = 4 / 3;

/** 手机布局的断点（像素）：此宽度以下两张图上下排列，并启用手机端判定。styles.css 的 @media 必须与此一致。 */
export const MOBILE_BREAKPOINT_PX = 720;

export const MOBILE_LAYOUT_QUERY = `(max-width: ${MOBILE_BREAKPOINT_PX}px)`;
