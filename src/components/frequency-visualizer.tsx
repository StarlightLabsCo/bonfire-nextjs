import { FC } from 'react';

interface FrequencyVisualizerProps {
  data: Uint8Array;
}

const FrequencyVisualizer: FC<FrequencyVisualizerProps> = ({ data }) => {
  const normalizedData = Array.from(data).map((value) => value / 255);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      {normalizedData.map((value, index) => (
        <div
          key={index}
          style={{
            width: 50,
            height: Math.max(50, value * 100), // Adjust the multiplier to control the maximum expansion
            borderRadius: '50%',
            transform: `translateY(${(1 - value) * 50}px)`, // Adjust the multiplier to control the maximum vertical movement
            backgroundColor: 'white',
            transition: 'height 0.1s ease-out, transform 0.1s ease-out',
            margin: '0 10px', // Add some horizontal margin between the bubbles
          }}
        />
      ))}
    </div>
  );
};

export default FrequencyVisualizer;
