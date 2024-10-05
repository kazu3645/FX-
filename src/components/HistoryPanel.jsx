import React from 'react';
import { Table, Paper, Text } from '@mantine/core';

export function HistoryPanel({ tradeHistory }) {
  const rows = tradeHistory.map((trade, index) => (
    <tr key={index}>
      <td>{new Date(trade.timestamp).toLocaleString()}</td>
      <td>{trade.pair}</td>
      <td>{trade.type}</td>
      <td>{trade.amount}</td>
      <td>{trade.profit.toFixed(2)}</td>
    </tr>
  ));

  return (
    <Paper shadow="xs" p="md" mt="xl">
      <Text size="xl" weight={700} mb="md">取引履歴</Text>
      <Table>
        <thead>
          <tr>
            <th>日時</th>
            <th>通貨ペア</th>
            <th>タイプ</th>
            <th>取引量</th>
            <th>損益</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Paper>
  );
}