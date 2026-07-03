import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';

export default function DGHomeScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      const data = await api('GET', '/requests?status=pending');
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
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RequestDetail', { request: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.supplierName}</Text>
        <Text style={styles.badge}>En attente</Text>
      </View>
      <Text style={styles.company}>{item.company}</Text>
      <Text style={styles.reason} numberOfLines={1}>{item.reason}</Text>
      <Text style={styles.meta}>Par {item.createdByName} • {item.startDate}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <Text style={styles.header}>{requests.length} demande(s) en attente</Text>
        }
        ListEmptyComponent={<Text style={styles.empty}>Aucune demande en attente</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { fontSize: 16, fontWeight: '600', padding: 16, paddingBottom: 8, color: '#333' },
  card: { backgroundColor: '#fff', marginHorizontal: 12, marginVertical: 4, padding: 14, borderRadius: 8, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '600' },
  badge: { color: '#f59e0b', fontSize: 12, fontWeight: '600' },
  company: { color: '#666', marginTop: 2 },
  reason: { color: '#444', marginTop: 4, fontSize: 13 },
  meta: { color: '#999', fontSize: 12, marginTop: 6 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
});
