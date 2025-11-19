import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';

type MeetingData = {
  month: string;
  count: number;
  count2: number;
};

type WeekData = {
  id: number;
  month: string;
  week: number;
  count: number;
};

const IndicadorePorMes = () => {
  // Datos de ejemplo - reuniones por mes
  const [meetingData, setMeetingData] = useState<MeetingData[]>([
    { month: 'Ene', count: 3, count2: 2 },
    { month: 'Feb', count: 5, count2: 3 },
    { month: 'Mar', count: 2, count2: 5 },
    { month: 'Abr', count: 4, count2: 2 },
    // { month: 'May', count: 6 },
    // { month: 'Jun', count: 8 },
  ]);

  const [DataWeek, setDataWeek] = useState<WeekData[]>([
    { id: 1, month: 'Ene', week: 1, count: 10 },
    { id: 2, month: 'Ene', week: 2, count: 12 },
    { id: 3, month: 'Ene', week: 3, count: 10 },
    { id: 4, month: 'Ene', week: 4, count: 13 },
    { id: 5, month: 'Feb', week: 1, count: 10 },
    { id: 6, month: 'Feb', week: 2, count: 14 },
    { id: 7, month: 'Feb', week: 3, count: 2 },
    { id: 8, month: 'Feb', week: 4, count: 5 },
    { id: 9, month: 'Mar', week: 1, count: 10 },
    { id: 10, month: 'Mar', week: 2, count: 14 },
    { id: 11, month: 'Mar', week: 3, count: 10 },
    { id: 12, month: 'Mar', week: 4, count: 15 },
    { id: 13, month: 'Abr', week: 1, count: 10 },
    { id: 14, month: 'Abr', week: 2, count: 2 },
    { id: 15, month: 'Abr', week: 3, count: 2 },
    { id: 16, month: 'Abr', week: 4, count: 2 },
  ]);

  // Datos para el gráfico
  const chartData = {
    labels: meetingData.map(item => item.month),
    datasets: [
      {
        data: meetingData.map(item => item.count),
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, // Color de la línea
        strokeWidth: 2 // Ancho de la línea
      },
      {
        data: meetingData.map(item => item.count2),
        color: (opacity = 1) => `rgba(175, 92, 192, ${opacity})`, // Color de la línea
        strokeWidth: 2 // Ancho de la línea
      },
    ],
  };

  // Configuración del gráfico
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#4bc0c0'
    }
  };

  // Calcular el promedio de reuniones
  const averageMeetings = meetingData.reduce((acc, curr) => acc + curr.count, 0) / meetingData.length;

  return (
    <View style={styles.container}>
      {/* Gráfico de líneas */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Reuniones por mes -- hola Luis</Text>
        {/* <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={160}
          // height={220}
          yAxisSuffix=""
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withVerticalLines={false}
        /> */}
      </View>

      {/* Indicador estático */}
      <View style={styles.staticIndicator}>
        <Text style={styles.staticNumber}>{meetingData.length}</Text>
        <Text style={styles.staticLabel}>Meses registrados</Text>
      </View>

      {/* Indicador de promedio */}
      <View style={styles.averageIndicator}>
        <Text style={styles.averageNumber}>{averageMeetings.toFixed(1)}</Text>
        <Text style={styles.averageLabel}>Promedio mensual</Text>
      </View>

      <Text style={{ marginTop: 110, fontSize: 18, fontWeight: '600', }}>Reuniones por semana</Text>

      {/* Lista de reuniones */}
      <FlatList
        data={DataWeek}
        // keyExtractor={(item) => item.month}
        renderItem={({ item }) => (
          <View style={styles.dataItem}>
            <Text style={styles.monthText}>{item.month}</Text>
            <Text style={styles.monthText}>Semana {item.week}</Text>
            <Text style={styles.countText}>{item.count} reuniones</Text>
          </View>
        )}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingTop: 15,
    paddingBottom: 35,
    paddingLeft: 15,
    paddingRight: 5,
    marginBottom: 10,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 10,
    color: '#2c3e50',
  },
  chart: {
    borderRadius: 12,
  },
  staticIndicator: {
    position: 'absolute',
    top: 245,
    right: 19,
    backgroundColor: '#4bc0c0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    width: 110,
  },
  staticNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  staticLabel: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
  },
  averageIndicator: {
    position: 'absolute',
    top: 245,
    left: 19,
    backgroundColor: '#ffa726',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    width: 110,
  },
  averageNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  averageLabel: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
  },
  dataItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  countText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  list: {
    marginTop: 20,
  },
});

export default IndicadorePorMes;
