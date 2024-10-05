import React from 'react';
import { Table, Button, Paper, Text } from '@mantine/core';

export function PositionsPanel({ positions, onClosePosition }) {
  const rows = positions.map((position) => (
    <tr key={position.id}>
      <td>{position.pair}</td>
      <td>{position.type}</td>
      <td>{position.amount}</td>
      <td>{position.openPrice.toFixed(3)}</td>
      <td>{position.currentProfit.toFixed(2)}</td>
      <td>
        <Button size="xs" color="red" onClick={() => onClosePosition(position.id)}>
          決済
        </Button>
      </td>
    </tr>
  ));

  return (
    <Paper shadow="xs" p="md">
      <Text size="xl" weight={700} mb="md">保有ポジション</Text>
      <Table>
        <thead>
          <tr>
            <th>通貨ペア</th>
            <th>タイプ</th>
            <th>取引量</th>
            <th>オープン価格</th>
            <th>現在の損益</th>
            <th>アクション</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Paper>
  );
}