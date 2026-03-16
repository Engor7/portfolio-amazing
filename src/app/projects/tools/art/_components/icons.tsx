import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export const RainbowIcon = (props: IconProps) => (
   <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
      {...props}
   >
      <path d="M22 17a10 10 0 0 0-20 0" />
      <path d="M6 17a6 6 0 0 1 12 0" />
      <path d="M10 17a2 2 0 0 1 4 0" />
   </svg>
);

export const PenIcon = (props: IconProps) => (
   <svg
      width="32"
      height="32"
      viewBox="0 0 15 15"
      fill="currentColor"
      aria-hidden="true"
      {...props}
   >
      <path d="M11.225 1.082a.5.5 0 0 1 .629.064l2 2l.064.079a.5.5 0 0 1-.064.629l-7.432 7.431a1 1 0 0 1-.228.171l-.086.041l-3.41 1.463a.5.5 0 0 1-.658-.657l1.463-3.411l.04-.086q.07-.126.172-.228l7.432-7.432zM4.422 9.285L3.78 10.78l.438.438l1.497-.64L12.793 3.5L11.5 2.207z" />
   </svg>
);

export const UndoIcon = (props: IconProps) => (
   <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
   >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
   </svg>
);

export const RedoIcon = (props: IconProps) => (
   <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
   >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
   </svg>
);

export const SunIcon = (props: IconProps) => (
   <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
   >
      <path
         fillRule="evenodd"
         d="M12 8.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7M6.5 12a5.5 5.5 0 1 1 11 0a5.5 5.5 0 0 1-11 0M12 2a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1m0 16.5a1 1 0 0 1 1 1V21a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1M5.5 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1.5a1 1 0 0 1 1 1M22 12a1 1 0 0 1-1 1h-1.5a1 1 0 1 1 0-2H21a1 1 0 0 1 1 1M7.404 16.596a1 1 0 0 1 0 1.414l-1.06 1.061a1 1 0 0 1-1.415-1.414l1.06-1.06a1 1 0 0 1 1.415 0ZM19.071 4.929a1 1 0 0 1 0 1.414l-1.06 1.06a1 1 0 1 1-1.415-1.413l1.06-1.061a1 1 0 0 1 1.415 0m-2.475 11.667a1 1 0 0 1 1.414 0l1.061 1.06a1 1 0 0 1-1.414 1.415l-1.06-1.06a1 1 0 0 1 0-1.415ZM4.929 4.929a1 1 0 0 1 1.414 0l1.06 1.06A1 1 0 1 1 5.99 7.405l-1.061-1.06a1 1 0 0 1 0-1.415Z"
         clipRule="evenodd"
      />
   </svg>
);

export const MoonIcon = (props: IconProps) => (
   <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
   >
      <path
         fillRule="evenodd"
         d="M19.008 13.562c.588-.15 1.656-.177 2.41.74c.588.716.552 1.535.519 1.86c-.078.761-.44 1.53-.862 2.07c-2.283 2.92-6.196 4.21-9.845 3.75c-5.744-.723-9.815-5.967-9.091-11.711c.223-1.769.74-3.355 1.694-4.701c.961-1.357 2.272-2.337 3.864-3.035a7.1 7.1 0 0 1 1.939-.52c.18-.018.4-.03.638-.014c.209.014.587.06.983.262a2.17 2.17 0 0 1 1.157 1.538c.129.7-.116 1.256-.261 1.522c-.175.32-.424.838-.64 1.376c-.232.576-.356 1.006-.38 1.207a5.326 5.326 0 0 0 4.618 5.95c.233.03.826.02 1.591-.05c.738-.07 1.384-.173 1.666-.244m.76 2.995c.264-.567.301-1.201-.268-1.057c-.351.09-.923.182-1.542.252l-.025.003c-.895.1-1.882.155-2.432.085a7.326 7.326 0 0 1-6.353-8.184c.054-.432.234-1 .453-1.563l.068-.17c.241-.597.518-1.173.727-1.557c.193-.352-.164-.415-.642-.35a5.3 5.3 0 0 0-1.68.55C5.71 5.742 4.488 7.618 4.123 10.52a8.483 8.483 0 0 0 7.356 9.477c2.769.348 5.614-.518 7.452-2.357A7 7 0 0 0 19.5 17c.102-.13.194-.284.268-.444ZM10.066 5.992h-.003Z"
         clipRule="evenodd"
      />
      <path
         fill="currentColor"
         d="M14.883 7.585a.238.238 0 0 1 .38.047q.016.032.043.056a.24.24 0 0 1-.048.38a.2.2 0 0 0-.056.043a.237.237 0 0 1-.379-.048a.2.2 0 0 0-.043-.056a.237.237 0 0 1 .047-.379a.2.2 0 0 0 .056-.043"
      />
      <path
         fill="currentColor"
         fillRule="evenodd"
         d="M15.678 7.354a.737.737 0 0 1-.142 1.13a.737.737 0 0 1-1.129-.143a.737.737 0 0 1 .142-1.129a.737.737 0 0 1 1.13.142Zm-.523.638a.26.26 0 0 0 .032-.256a.26.26 0 0 0-.256-.032a.26.26 0 0 0-.049.195q.005.03.017.06a.26.26 0 0 0 .256.033"
         clipRule="evenodd"
      />
      <path
         fill="currentColor"
         d="M18.235 4.983c.11-.116.3-.092.378.048q.018.031.044.056c.116.11.092.3-.048.379a.2.2 0 0 0-.056.043a.237.237 0 0 1-.378-.048a.2.2 0 0 0-.044-.056a.237.237 0 0 1 .048-.378a.2.2 0 0 0 .056-.044"
      />
      <path
         fill="currentColor"
         fillRule="evenodd"
         d="M19.03 4.753a.737.737 0 0 1-.143 1.129a.737.737 0 0 1-1.128-.143a.737.737 0 0 1 .142-1.129a.737.737 0 0 1 1.129.143m-.524.637a.26.26 0 0 0 .049-.195a.3.3 0 0 0-.017-.06a.26.26 0 0 0-.256-.033a.26.26 0 0 0-.032.256a.26.26 0 0 0 .256.032"
         clipRule="evenodd"
      />
      <path
         fill="currentColor"
         d="M18.602 10.069a.237.237 0 0 1 .379.047q.017.032.043.057c.116.11.092.3-.047.378a.2.2 0 0 0-.056.044a.237.237 0 0 1-.379-.048a.2.2 0 0 0-.044-.056a.237.237 0 0 1 .048-.379a.2.2 0 0 0 .056-.043"
      />
      <path
         fill="currentColor"
         fillRule="evenodd"
         d="M19.397 9.838a.737.737 0 0 1-.142 1.13a.737.737 0 0 1-1.13-.143a.737.737 0 0 1 .143-1.129a.737.737 0 0 1 1.13.142Zm-.524.638a.26.26 0 0 0 .051-.143a.3.3 0 0 0-.018-.113a.26.26 0 0 0-.143-.051a.3.3 0 0 0-.113.019a.26.26 0 0 0-.051.142a.3.3 0 0 0 .018.114a.26.26 0 0 0 .143.05a.3.3 0 0 0 .113-.018"
         clipRule="evenodd"
      />
   </svg>
);

export const DownloadIcon = (props: IconProps) => (
   <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
   >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
   </svg>
);

export const TrashIcon = (props: IconProps) => (
   <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
      {...props}
   >
      <path d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
   </svg>
);
