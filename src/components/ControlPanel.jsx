import React from 'react';
import { Group, Button, Slider, Text } from '@mantine/core';
import { PlayerPlay, PlayerPause, PlayerTrackNext, ArrowBackUp } from 'tabler-icons-react';

export function ControlPanel({ onSpeedChange }) {
  const handleSpeedChange = (value) => {
    onSpeedChange(value);
  };

  return (
    <Group position="center" spacing="md">
      <Button.Group>
        <Button leftIcon={<ArrowBackUp size={18} />}>リセット</Button>
        <Button leftIcon={<PlayerPlay size={18} />}>再生</Button>
        <Button leftIcon={<PlayerPause size={18} />}>一時停止</Button>
        <Button leftIcon={<PlayerTrackNext size={18} />}>次のキャンドル</Button>
      </Button.Group>
      <Group align="center" style={{ width: '300px' }}>
        <Text size="sm" style={{ minWidth: '80px' }}>再生速度:</Text>
        <Slider
          min={0.1}
          max={10}
          step={0.1}
          value={1}
          onChange={handleSpeedChange}
          style={{ flex: 1 }}
          marks={[
            { value: 0.1, label: '0.1x' },
            { value: 1, label: '1x' },
            { value: 5, label: '5x' },
            { value: 10, label: '10x' },
          ]}
        />
      </Group>
    </Group>
  );
}