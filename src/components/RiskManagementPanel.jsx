import React, { useState } from 'react';
import { NumberInput, Stack, Text, Progress } from '@mantine/core';

export function RiskManagementPanel() {
  const [balance, setBalance] = useState(10000);
  const [riskPerTrade, setRiskPerTrade] = useState(1);

  const maxLoss = balance * (riskPerTrade / 100);

  return (
    <Stack spacing="md" mt="xl">
      <Text size="xl" weight={700}>リスク管理</Text>
      <NumberInput
        label="口座残高"
        value={balance}
        onChange={(val) => setBalance(val)}
        icon="$"
      />
      <NumberInput
        label="1トレードあたりのリスク (%)"
        value={riskPerTrade}
        onChange={(val) => setRiskPerTrade(val)}
        min={0}
        max={100}
        step={0.1}
      />
      <Text size="sm">最大損失額: ${maxLoss.toFixed(2)}</Text>
      <Progress
        value={riskPerTrade}
        label={`${riskPerTrade}%`}
        size="xl"
        radius="xl"
      />
    </Stack>
  );
}