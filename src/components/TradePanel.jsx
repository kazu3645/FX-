import React, { useState, useEffect } from 'react';
import { TextInput, NumberInput, Select, Button, Stack, Text, Group, Switch, Slider, Paper } from '@mantine/core';
import { CurrencyDollar, ArrowUpRight, ArrowDownRight } from 'tabler-icons-react';

export function TradePanel({ onTrade, currentPrice, balance }) {
  const [amount, setAmount] = useState(0.01);
  const [leverage, setLeverage] = useState(100);
  const [pair, setPair] = useState('USDJPY');
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState(currentPrice.ask);
  const [stopLoss, setStopLoss] = useState(0);
  const [takeProfit, setTakeProfit] = useState(0);
  const [riskPerTrade, setRiskPerTrade] = useState(1);
  const [autoLot, setAutoLot] = useState(false);

  useEffect(() => {
    if (autoLot) {
      const riskAmount = balance * (riskPerTrade / 100);
      const pipValue = 0.01; // Assuming 1 pip = 0.01 for USDJPY
      const newAmount = (riskAmount / (100 * pipValue)).toFixed(2);
      setAmount(parseFloat(newAmount));
    }
  }, [autoLot, balance, riskPerTrade, currentPrice]);

  const handleTrade = (type) => {
    const trade = {
      type,
      pair,
      amount,
      leverage,
      orderType,
      limitPrice: orderType === 'limit' ? limitPrice : currentPrice[type === 'Buy' ? 'ask' : 'bid'],
      stopLoss,
      takeProfit,
      openPrice: currentPrice[type === 'Buy' ? 'ask' : 'bid'],
      timestamp: new Date().toISOString(),
    };
    console.log('Trade placed:', trade);
    onTrade(trade);
  };

  return (
    <Paper shadow="xs" p="md">
      <Stack spacing="md">
        <Text size="xl" weight={700}>トレードパネル</Text>
        <Select
          label="通貨ペア"
          value={pair}
          onChange={setPair}
          data={[
            { value: 'USDJPY', label: 'USD/JPY' },
            { value: 'EURJPY', label: 'EUR/JPY' },
            { value: 'GBPJPY', label: 'GBP/JPY' },
            { value: 'AUDJPY', label: 'AUD/JPY' },
          ]}
        />
        <NumberInput
          label="取引量 (Lot)"
          value={amount}
          onChange={(val) => setAmount(val)}
          precision={2}
          step={0.01}
          min={0.01}
          max={100}
          icon={<CurrencyDollar size={18} />}
        />
        <NumberInput
          label="レバレッジ"
          value={leverage}
          onChange={(val) => setLeverage(val)}
          min={1}
          max={1000}
        />
        <Select
          label="注文タイプ"
          value={orderType}
          onChange={setOrderType}
          data={[
            { value: 'market', label: '成行注文' },
            { value: 'limit', label: '指値注文' },
            { value: 'stop', label: '逆指値注文' },
          ]}
        />
        {orderType !== 'market' && (
          <NumberInput
            label={orderType === 'limit' ? "指値価格" : "逆指値価格"}
            value={limitPrice}
            onChange={(val) => setLimitPrice(val)}
            precision={3}
          />
        )}
        <NumberInput
          label="損切り (pips)"
          value={stopLoss}
          onChange={(val) => setStopLoss(val)}
          min={0}
        />
        <NumberInput
          label="利益確定 (pips)"
          value={takeProfit}
          onChange={(val) => setTakeProfit(val)}
          min={0}
        />
        <Group grow>
          <NumberInput
            label="1トレードあたりのリスク (%)"
            value={riskPerTrade}
            onChange={(val) => setRiskPerTrade(val)}
            min={0}
            max={100}
            step={0.1}
          />
          <Switch
            label="自動ロット計算"
            checked={autoLot}
            onChange={(event) => setAutoLot(event.currentTarget.checked)}
          />
        </Group>
        <Group grow>
          <Button leftIcon={<ArrowUpRight size={18} />} color="teal" onClick={() => handleTrade('Buy')}>
            買い {currentPrice.ask.toFixed(3)}
          </Button>
          <Button leftIcon={<ArrowDownRight size={18} />} color="red" onClick={() => handleTrade('Sell')}>
            売り {currentPrice.bid.toFixed(3)}
          </Button>
        </Group>
        <Text size="sm" align="center">
          スプレッド: {((currentPrice.ask - currentPrice.bid) * 1000).toFixed(1)} pips
        </Text>
      </Stack>
    </Paper>
  );
}