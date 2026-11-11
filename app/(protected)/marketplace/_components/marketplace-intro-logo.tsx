import { useId, type FC } from "react";

// The original symbol from public/logo-horizontal.svg, grouped for the cheese pull.
export const MarketplaceIntroLogo: FC = () => {
  const gradientId = useId();
  const cheeseMaskId = useId();

  return (
    <svg viewBox="-40 -12 400 236" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0.7">
          <stop stopColor="#FBBF24" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
        <mask
          id={cheeseMaskId}
          maskUnits="userSpaceOnUse"
          x="40"
          y="30"
          width="240"
          height="140"
        >
          <rect x="40" y="30" width="240" height="140" fill="#FFFFFF" />
          <g data-intro-cheese-tears fill="#000000" opacity="0">
            <path d="M88 100C100 95 114 95 130 99C119 100 103 106 88 100Z" />
            <path d="M135 92C147 87 166 89 184 94C167 93 153 99 135 92Z" />
            <path d="M185 105C200 99 217 96 235 99C221 103 203 112 185 105Z" />
            <path d="M119 111C130 107 142 108 153 111C141 112 130 115 119 111Z" />
          </g>
        </mask>
      </defs>
      <g
        fill="none"
        stroke="#0F172A"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          data-intro-brace="left"
          d="M74 22H66C43 22 38 39 38 55V73C38 91 29 106 12 106C29 106 38 121 38 139V157C38 173 43 190 66 190H74"
        />
        <path
          data-intro-brace="right"
          d="M246 22H254C277 22 282 39 282 55V73C282 91 291 106 308 106C291 106 282 121 282 139V157C282 173 277 190 254 190H246"
        />
      </g>
      <g data-intro-cheese>
        <g mask={`url(#${cheeseMaskId})`}>
          <path fill="#0F172A" d="M66 63Q160 126 254 63V153Q160 99 66 153Z" />
          <path
            fill={`url(#${gradientId})`}
            d="M66 49Q160 114 254 49C255 78 258 96 267 106C258 116 255 134 254 153Q160 73 66 153C65 134 62 116 53 106C62 96 65 78 66 49Z"
          />
          <path
            fill="#FBBF24"
            d="M66 49Q160 114 254 49Q234 104 127 105Q91 118 66 153C65 134 62 116 53 106C62 96 65 78 66 49Z"
          />
          <path
            fill="#FFFFFF"
            opacity=".24"
            d="M81 67Q156 106 224 78Q214 89 160 93Q108 91 81 67Z"
          />
          <g
            data-intro-cheese-strands
            fill="none"
            stroke="#FFFFFF"
            strokeLinecap="round"
            opacity="0"
          >
            <path
              d="M75 89C112 83 163 105 241 85"
              strokeWidth="1.2"
              opacity=".65"
            />
            <path
              d="M81 107C132 96 177 108 239 94"
              strokeWidth=".9"
              opacity=".4"
            />
            <path
              d="M77 123C122 106 188 120 245 109"
              strokeWidth="1.1"
              opacity=".5"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
