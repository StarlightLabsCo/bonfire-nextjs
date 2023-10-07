import { FC } from 'react';

interface FrequencyVisualizerProps {
  data: Uint8Array;
}

const FrequencyVisualizer: FC<FrequencyVisualizerProps> = ({ data }) => {
  const normalizedData = Array.from(data).map((value) => value / 255);

  return (
    <div className="flex items-center justify-center w-8 h-8">
      {normalizedData.map((value, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center"
          style={{
            width: '1rem',
            transition: 'height 0.1s ease-out, transform 0.1s ease-out',
            margin: '0 0.1rem',
          }}
        >
          <div
            style={{
              height: `${value + 1}rem`,
              width: '1rem',
              background: 'white',
              borderRadius: '100%',
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FrequencyVisualizer;
