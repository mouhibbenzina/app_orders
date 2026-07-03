import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { getSocket } from '../api/socket';

export default function GuardHomeScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      const data = await api('GET', '/requests?status=validated');
      setRequests(data);
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => { fetchRequests(); }, [])
  );

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handler = (data) => {
      if (data.status === 'validated') {
        setRequests((prev) => {
          const exists = prev.find((r) => r.id === data.id);
          if (exists) return prev.map((r) => (r.id === data.id ? data : r));
          return [...prev, data];
        });
      } else {
        setRequests((prev) => prev.filter((r) => r.id !== data.id));
      }
    };
    socket.on('request-updated', handler);
    return () => socket.off('request-updated', handler);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.supplierName}</Text>
      <Text style={styles.company}>{item.company}</Text>
      <Text style={styles.reason} numberOfLines={1}>{item.reason}</Text>
      <Text style={styles.period}>{item.startDate} → {item.endDate}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
            <Text style={styles.refreshText}>Rafraîchir</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={<Text style={styles.empty}>Aucun accès autorisé aujourd'hui</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  refreshBtn: { alignSelf: 'center', marginVertical: 10 },
  refreshText: { color: '#1a73e8', fontSize: 14, fontWeight: '600' },
  card: {
    backgroundColor: '#fff', marginHorizontal: 12, marginVertical: 4,
    padding: 14, borderRadius: 8, elevation: 1, borderLeftWidth: 4, borderLeftColor: '#10b981',
  },
  name: { fontSize: 16, fontWeight: '600' },
  company: { color: '#666', marginTop: 2 },
  reason: { color: '#444', marginTop: 4, fontSize: 13 },
  period: { color: '#999', fontSize: 12, marginTop: 6 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
});
