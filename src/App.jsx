import React, { useState, useEffect } from 'react';
import { MantineProvider, AppShell, Navbar, Header, Footer, Text, MediaQuery, Burger, useMantineTheme, Grid, Container } from '@mantine/core';
import { TradePanel } from './components/TradePanel';
import { PositionsPanel } from './components/PositionsPanel';
import { ControlPanel } from './components/ControlPanel';
import { StatisticsPanel } from './components/StatisticsPanel';
import { CurrentPriceDisplay } from './components/CurrentPriceDisplay';
import { getCurrentPrice, connectToMT4 } from './utils/mt4Connection';

function App() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [currentPrice, setCurrentPrice] = useState({ bid: 100.000, ask: 100.002 });
  const [positions, setPositions] = useState([]);
  const [balance, setBalance] = useState(10000);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    const initMT4Connection = async () => {
      await connectToMT4();
    };
    initMT4Connection();

    const interval = setInterval(async () => {
      const newPrice = await getCurrentPrice();
      setCurrentPrice(newPrice);
      updatePositions(newPrice);
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [playbackSpeed]);

  const updatePositions = (price) => {
    setPositions(prevPositions => 
      prevPositions.map(position => ({
        ...position,
        currentProfit: calculateProfit(position, price)
      }))
    );
  };

  const calculateProfit = (position, currentPrice) => {
    const priceDiff = position.type === 'Buy' 
      ? currentPrice.bid - position.openPrice 
      : position.openPrice - currentPrice.ask;
    return priceDiff * position.amount * 100000; // Assuming 1 lot = 100,000 units
  };

  const handleTrade = (trade) => {
    setPositions(prevPositions => [...prevPositions, { ...trade, id: Date.now(), currentProfit: 0 }]);
    setBalance(prevBalance => prevBalance - trade.amount * 100000 * 0.01); // Deduct margin
  };

  const handleClosePosition = (positionId) => {
    const position = positions.find(p => p.id === positionId);
    if (position) {
      setBalance(prevBalance => prevBalance + position.currentProfit);
      setPositions(prevPositions => prevPositions.filter(p => p.id !== positionId));
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
  };

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
      <AppShell
        styles={{
          main: {
            background: theme.colors.dark[8],
            color: theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        navbar={
          <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 300, lg: 400 }}>
            <TradePanel onTrade={handleTrade} currentPrice={currentPrice} balance={balance} />
          </Navbar>
        }
        footer={
          <Footer height={60} p="md">
            <ControlPanel onSpeedChange={handleSpeedChange} />
          </Footer>
        }
        header={
          <Header height={60} p="md">
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <Text size="xl" weight={700}>FX裁量トレード練習ツール</Text>
            </div>
          </Header>
        }
      >
        <Container fluid>
          <Grid>
            <Grid.Col span={12}>
              <CurrentPriceDisplay price={currentPrice} />
            </Grid.Col>
            <Grid.Col span={8}>
              <PositionsPanel positions={positions} onClosePosition={handleClosePosition} />
            </Grid.Col>
            <Grid.Col span={4}>
              <StatisticsPanel positions={positions} balance={balance} />
            </Grid.Col>
          </Grid>
        </Container>
      </AppShell>
    </MantineProvider>
  );
}

export default App;