import styled from "styled-components";

const Text = styled.span.withConfig({
    shouldForwardProp: (prop) =>
        ![
            "center",
            "noWrap",
            "breakSpaces",
            "wordBreak",
            "lineHeight",
            "letterSpacing",
            "lineThrough",
            "width",
            "fontSize",
            "fontWeight",
            "fontFamily",
            "color"
        ].includes(prop),
})<{
    fontSize?: number | string
    fontWeight?: number
    fontFamily?: string
    color?: string
    center?: boolean
    width?: number
    noWrap?: boolean
    breakSpaces?: boolean
    wordBreak?: string
    lineHeight?: number | string
    letterSpacing?: number
    lineThrough?: boolean
}>`
    font-family: ${({fontFamily}) => fontFamily ?? 'inherit'};
    font-size: ${({fontSize}) =>
            fontSize ? (typeof fontSize === "string" ? fontSize : `${fontSize}px`) : "inherit"};
    font-weight: ${({fontWeight}) => fontWeight ?? "inherit"};
    color: ${({color}) => color ?? "inherit"};
    text-align: ${({center}) => (center ? 'center' : 'inherit')};
    width: ${({width}) => (width ? `${width}px` : 'unset')};

    ${({noWrap}) => noWrap && 'white-space: nowrap;'}
    ${({breakSpaces}) => breakSpaces && 'white-space: break-spaces;'}
    ${({wordBreak}) => wordBreak && `word-break: ${wordBreak};`}

    line-height: ${({lineHeight}) => lineHeight ?? 'inherit'};
    letter-spacing: ${({letterSpacing}) => letterSpacing ? `${letterSpacing}px` : 'inherit'};

    ${({lineThrough}) => lineThrough && 'text-decoration: line-through;'}
`;

export default Text;
