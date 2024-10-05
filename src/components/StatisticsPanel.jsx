import React from 'react';
import { Paper, Text, Group, RingProgress, Stack, Grid, Progress } from '@mantine/core';

export function StatisticsPanel({ positions, balance }) {
  const closedPositions = positions.filter(p => p.closed);
  const totalTrades = closedPositions.length;
  const profitableTrades = closedPositions.filter(p => p.profit > 0).length;
  const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;
  
  const totalProfit = closedPositions.reduce((sum, p) => sum + p.profit, 0);
  const totalLoss = closedPositions.reduce((sum, p) => sum + (p.profit < 0 ? p.profit : 0), 0);
  const profitFactor = Math.abs(totalLoss) > 0 ? Math.abs(totalProfit / totalLoss) : 0;
  
  const equity = balance + positions.reduce((sum, p) => sum + (p.currentProfit || 0), 0);
  const drawdown = ((balance - equity) / balance) * 100;
  
  const averageWin = profitableTrades > 0 ? totalProfit / profitableTrades : 0;
  const averageLoss = (totalTrades - profitableTrades) > 0 ? Math.abs(totalLoss) / (totalTrades - profitableTrades) : 0;
  const riskRewardRatio = averageLoss > 0 ? averageWin / averageLoss : 0;

  const expectancy = (winRate / 100) * averageWin - ((100 - winRate) / 100) * averageLoss;

  return (
    <Paper shadow="xs" p="md">
      <Text size="xl" weight={700} mb="md">トレード統計</Text>
      <Grid>
        <Grid.Col span={6}>
          <Stack spacing="xs">
            <Group position="apart">
              <Text size="sm">残高:</Text>
              <Text weight={700}>${balance.toFixed(2)}</Text>
            </Group>
            <Group position="apart">
              <Text size="sm">純資産:</Text>
              <Text weight={700}>${equity.toFixed(2)}</Text>
            </Group>
            <Group position="apart">
              <Text size="sm">総利益:</Text>
              <Text weight={700} color="teal">${totalProfit.toFixed(2)}</Text>
            </Group>
            <Group position="apart">
              <Text size="sm">総損失:</Text>
              <Text weight={700} color="red">${totalLoss.toFixed(2)}</Text>
            </Group>
            <Group position="apart">
              <Text size="sm">ドローダウン:</Text>
              <Text weight={700} color={drawdown > 10 ? 'red' : 'orange'}>{drawdown.toFixed(2)}%</Text>
            </Group>
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>
          <Stack spacing="xs" align="center">
            <RingProgress
              sections={[{ value: winRate, color: 'teal' }]}
              label={
                <Text size="xs" align="center">
                  勝率
                  <Text size="lg" align="center" weight={700}>{winRate.toFixed(1)}%</Text>
                </Text>
              }
              size={120}
            />
            <Text size="sm" weight={700} mt="sm">総取引数: {totalTrades}</Text>
          </Stack>
        </Grid.Col>
      </Grid>
      <Stack spacing="xs" mt="md">
        <Group position="apart">
          <Text size="sm">プロフィットファクター:</Text>
          <Text weight={700} color={profitFactor >= 1.5 ? 'teal' : 'orange'}>{profitFactor.toFixed(2)}</Text>
        </Group>
        <Group position="apart">
          <Text size="sm">リスク/リワード比:</Text>
          <Text weight={700} color={riskRewardRatio >= 1.5 ? 'teal' : 'orange'}>{riskRewardRatio.toFixed(2)}</Text>
        </Group>
        <Group position="apart">
          <Text size="sm">期待値:</Text>
          <Text weight={700} color={expectancy > 0 ? 'teal' : 'red'}>${expectancy.toFixed(2)}</Text>
        </Group>
        <Text size="sm" weight={700} mt="sm">平均利益 vs 平均損失</Text>
        <Progress
          sections={[
            { value: averageWin / (averageWin + averageLoss) * 100, color: 'teal' },
            { value: averageLoss / (averageWin + averageLoss) * 100, color: 'red' },
          ]}
          size="xl"
        />
        <Group position="apart">
          <Text size="xs" color="teal">${averageWin.toFixed(2)}</Text>
          <Text size="xs" color="red">${averageLoss.toFixed(2)}</Text>
        </Group>
      </Stack>
    </Paper>
  );
}