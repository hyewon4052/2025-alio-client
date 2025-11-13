import { CSSProperties, useMemo } from "react";

export const MAX_GLOBAL_WIDTH = 1920;
export const MAX_GLOBAL_HEIGHT = 1080;
export const GLOBAL_ASPECT_RATIO = MAX_GLOBAL_WIDTH / MAX_GLOBAL_HEIGHT;

type OverflowType = "visible" | "hidden" | "scroll" | "auto" | "initial" | "inherit";

interface ZoomedWrapperProps {
    width: number;
    height: number;
    overflowType?: OverflowType;
    id?: string;
    children: React.ReactNode;
    zIndex?: number;
    baseWidth?: number;
    baseHeight?: number;
    transformOrigin?: CSSProperties["transformOrigin"];
}

const ZoomedWrapper: React.FC<ZoomedWrapperProps> = ({
                                                         width,
                                                         height,
                                                         overflowType = "visible",
                                                         id,
                                                         children,
                                                         zIndex = 1,
                                                         baseWidth = MAX_GLOBAL_WIDTH,
                                                         baseHeight = MAX_GLOBAL_HEIGHT,
                                                         transformOrigin = "center center",
                                                     }) => {
    const zoomValue = useMemo(() => {
        const aspectRatio = width / height;
        const baseAspectRatio = baseWidth / baseHeight;
        return aspectRatio < baseAspectRatio ? width / baseWidth : height / baseHeight;
    }, [width, height, baseWidth, baseHeight]);

    return (
        <div
            id={id}
            style={{
                width: baseWidth,
                height: baseHeight,
                aspectRatio: `${baseWidth} / ${baseHeight}`,
                transform: `scale(${zoomValue})`,
                transformOrigin: transformOrigin,
                overflow: overflowType,
                zIndex: zIndex,
            }}
        >
            {children}
        </div>
    );

};

export default ZoomedWrapper;
