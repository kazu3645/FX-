import React from 'react';
import { Paper, Text, Group } from '@mantine/core';

export function CurrentPriceDisplay({ price }) {
  return (
    <Paper shadow="xs" p="md" mb="md">
      <Group position="apart">
        <Text size="xl" weight={700}>現在価格 (USD/JPY)</Text>
        <Group>
          <Text size="xl" color="blue">Bid: {price.bid.toFixed(3)}</Text>
          <Text size="xl" color="red">Ask: {price.ask.toFixed(3)}</Text>
        </Group>
      </Group>
    </Paper>
  );
}