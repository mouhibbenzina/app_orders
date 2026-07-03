import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';

const STATUS_COLORS = {
  pending: '#f59e0b',
  validated: '#10b981',
  refused: '#ef4444',
};

export default function HistoryScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filter !== 'all') params.append('status', filter);
      const qs = params.toString();
      const data = await api('GET', `/requests${qs ? '?' + qs : ''}`);
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.supplierName}</Text>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] }]}>
          <Text style={styles.badgeText}>
            {item.status === 'pending' ? 'En attente' : item.status === 'validated' ? 'Validée' : 'Refusée'}
          </Text>
        </View>
      </View>
      <Text style={styles.company}>{item.company}</Text>
      <Text style={styles.meta}>Par {item.createdByName} • {item.createdAt?.slice(0, 10)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom, entreprise..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={fetchRequests}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={fetchRequests}>
          <Text style={styles.searchBtnText}>OK</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterRow}>
        {['all', 'pending', 'validated', 'refused'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterActive]}
            onPress={() => { setFilter(f); setTimeout(fetchRequests, 0); }}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'Tout' : f === 'pending' ? 'En attente' : f === 'validated' ? 'Validées' : 'Refusées'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>Aucun résultat</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchRow: { flexDirection: 'row', padding: 8, backgroundColor: '#fff' },
  searchInput: {
    flex: 1, backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14,
  },
  searchBtn: { marginLeft: 8, backgroundColor: '#1a73e8', paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  searchBtnText: { color: '#fff', fontWeight: '600' },
  filterRow: { flexDirection: 'row', padding: 8, backgroundColor: '#fff', paddingTop: 0 },
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
  meta: { color: '#999', fontSize: 12, marginTop: 6 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
});
