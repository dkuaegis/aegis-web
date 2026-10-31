interface CompleteProps {
  message: string;
}

const BURST_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

const Complete = ({ message }: CompleteProps) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
    <svg
      className="join-success"
      viewBox="0 0 512 512"
      width={300}
      height={300}
      aria-hidden="true"
    >
      {BURST_ANGLES.map((angle) => (
        <g key={angle} transform={`rotate(${angle} 256 256)`}>
          <line
            className="join-success__burst"
            x1="256"
            y1="70"
            x2="256"
            y2="34"
          />
        </g>
      ))}
      <circle className="join-success__circle" cx="256" cy="256" r="160" />
      <path
        className="join-success__check"
        d="M174 272 236 324 345 197"
        pathLength={1}
      />
    </svg>
    <h2 className="font-semibold text-2xl tracking-tight">{message}</h2>
  </div>
);

export default Complete;
