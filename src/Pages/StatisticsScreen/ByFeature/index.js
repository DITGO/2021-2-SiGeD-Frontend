import React, { useState, useEffect } from 'react';
import { BsDownload } from 'react-icons/bs';
import {
  Cell, ResponsiveContainer, Tooltip,
  BarChart, CartesianGrid, XAxis, Bar, YAxis,
} from 'recharts';
import moment from 'moment';
import {
  Main, Title, Container, Card, TopDiv, MiddleDiv,
  FiltersDiv, SearchDiv, Button,
} from '../Style';
import { useProfileUser } from '../../../Context';
import activeClient from '../utils/alternateClient';
import { DemandStatistics } from '../../../Utils/reports/printDemandReport';
import StatisctsFilters from '../Filters';

const StatisticByFeature = () =>  {
    const { token, user, startModal } = useProfileUser();
    const [sectors, setSectors] = useState(['Todos']);
    const [loading, setLoading] = useState(true);
    const [featureGraphData, setFeatureGraphData] = useState([]);
    const [sectorActive, setSectorActive] = useState('Todos');
    const [sectorID, setSectorID] = useState('');
    const [categories, setCategories] = useState(['Todas']);
    const [categoryActive, setCategoryActive] = useState('Todas');
    const [categoryID, setCategoryID] = useState('');
    const [initialDate, setInitialDate] = useState(moment('2021-01-01').format('YYYY-MM-DD'));
    const [finalDate, setFinalDate] = useState(moment().format('YYYY-MM-DD'));
    const [clientID, setClientID] = useState(null);
    const [clientList, setClientList] = useState([]);
    const [active, setActive] = useState('Todas');
    const [query, setQuery] = useState('all');

    const getStatisticsFeature = async () => {
        await getDemandsStatistics(
        `statistic/feature=`,
        startModal,
        )
        .then((response) => {
            setCategoryStatistics(response?.data);
        });
    };

    useEffect(() => {
        if (user && token) {
            getStatisticsFeature();
        }
      }, [token, user]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D088FE', '#D0C49F', '#3FBB28', '#3F8042',
    '#EE88FE', '#EEC49F', '#11BB28', '#118042', '#D0FFFE', '#E08F9F', '#FF2928', '#6FED42'];

    return (
        <Main>
        {user ? (
          <Container>
            <TopDiv>
              <Title>Estatísticas - Caracteristicas</Title>
              <FiltersDiv>
                <SearchDiv>
                  <StatisctsFilters
                    setActive={setActive}
                    setClientID={setClientID}
                    setCategoryActive={setCategoryActive}
                    setSectorActive={setSectorActive}
                    categories={categories}
                    sectors={sectors}
                    clientList={clientList}
                    initialDate={initialDate}
                    setInitialDate={setInitialDate}
                    setFinalDate={setFinalDate}
                    finalDate={finalDate}
                  />
                </SearchDiv>
              </FiltersDiv>
              {
                featureGraphData.length > 0
                && (
                  <div style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'flex-end',
                    margin: '10px 0',
                  }}>
                    <Button onClick={() => DemandStatistics({
                      statisticsData: featureGraphData,
                      active,
                      clientID,
                      categoryActive,
                      initialDate,
                      sectorActive,
                      finalDate,
                      startModal,
                      reportType: 'FEATURE',
                    })}>
                      Baixar relatório
                      <BsDownload />
                    </Button>
                  </div>
                )
              }
            </TopDiv>
            <MiddleDiv>
              <Card>
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart
                    data={featureGraphData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 2,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" hide />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total">
                      {featureGraphData?.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="legenda">
                  {featureGraphData.map((entry, index) => (
                    <div
                      key={`cell-${index}`}
                      style={{
                        display: 'flex', alignItems: 'center', margin: '0px 4px', fontSize: '1.5rem',
                      }}>
                      <div style={{ width: '20px', height: '10px', backgroundColor: COLORS[index] }} />
                      <span style={{ margin: '0px 5px' }}>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </MiddleDiv>
          </Container>
        ) : <h1>Carregando...</h1>}
      </Main>
    )
}
export default StatisticByFeature;