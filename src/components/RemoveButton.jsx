"use client";

export default function RemoveButton({ isRed = false, ...props }) {
    return (
        <button
            {...props}
        >
            {/* ゴミ箱のSVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                <g>
                    <g>
                        <rect class="cls-1" fill="none" width="48" height="48" />
                    </g>
                    <g>
                        <line class="cls-2" fill="none" stroke={isRed? "#ff2727": "#000"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2px" x1="12.13" y1="12.63" x2="36.13" y2="36.13" />
                        <line class="cls-2" fill="none" stroke={isRed? "#ff2727": "#000"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2px" x1="12.38" y1="36.38" x2="35.88" y2="12.38" />
                    </g>
                </g>
            </svg>
        </button>
    )
}