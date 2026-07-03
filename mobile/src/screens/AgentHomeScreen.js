import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';

const STATUS_COLORS = {
  pending: '#f59e0b',
  validated: '#10b981',
  refused: '#ef4444',
};

export default function AgentHomeScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchRequests = async () => {
    try {
      const data = await api('GET', '/requests');
      setRequests(data);
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => { fetchRequests(); }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RequestDetail', { request: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.supplierName}</Text>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] }]}>
          <Text style={styles.badgeText}>
            {item.status === 'pending' ? 'En attente' : item.status === 'validated' ? 'Validée' : 'Refusée'}
          </Text>
        </View>
      </View>
      <Text style={styles.company}>{item.company}</Text>
      <Text style={styles.date}>{item.startDate} → {item.endDate}</Text>
      <Text style={styles.reason} numberOfLines={1}>{item.reason}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {['all', 'pending', 'validated', 'refused'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'Tout' : f === 'pending' ? 'En attente' : f === 'validated' ? 'Validées' : 'Refusées'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>Aucune demande</Text>}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewRequest')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  filterRow: { flexDirection: 'row', padding: 8, backgroundColor: '#fff' },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginHorizontal: 4, backgroundColor: '#eee' },
  filterActive: { backgroundColor: '#1a73e8' },
  filterText: { fontSize: 13, color: '#666' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  card: { backgroundColor: '#fff', marginHorizontal: 12, marginVertical: 4, padding: 14, borderRadius: 8, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '600' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  company: { color: '#666', marginTop: 2 },
  date: { color: '#888', fontSize: 12, marginTop: 4 },
  reason: { color: '#444', marginTop: 4, fontSize: 13 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#1a73e8', alignItems: 'center', justifyContent: 'center',
    elevation: 4,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
