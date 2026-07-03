import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function RequestDetailScreen({ route, navigation }) {
  const { request } = route.params;
  const { user } = useAuth();

  const handleValidate = async () => {
    try {
      await api('PATCH', `/requests/${request.id}/validate`);
      Alert.alert('Succès', 'Demande validée');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erreur', e.message);
    }
  };

  const handleRefuse = () => {
    Alert.prompt('Motif du refus', 'Veuillez saisir le motif', async (reason) => {
      try {
        await api('PATCH', `/requests/${request.id}/refuse`, { reason });
        Alert.alert('Succès', 'Demande refusée');
        navigation.goBack();
      } catch (e) {
        Alert.alert('Erreur', e.message);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Fournisseur</Text>
        <Text style={styles.value}>{request.supplierName}</Text>
        <Text style={styles.label}>Entreprise</Text>
        <Text style={styles.value}>{request.company}</Text>
        <Text style={styles.label}>Motif</Text>
        <Text style={styles.value}>{request.reason}</Text>
        <Text style={styles.label}>Période</Text>
        <Text style={styles.value}>{request.startDate} → {request.endDate}</Text>
        <Text style={styles.label}>Statut</Text>
        <Text style={[styles.value, {
          color: request.status === 'validated' ? '#10b981' : request.status === 'refused' ? '#ef4444' : '#f59e0b'
        }]}>
          {request.status === 'pending' ? 'En attente' : request.status === 'validated' ? 'Validée' : 'Refusée'}
        </Text>
        {request.status === 'refused' && request.refusalReason && (
          <>
            <Text style={styles.label}>Motif du refus</Text>
            <Text style={styles.value}>{request.refusalReason}</Text>
          </>
        )}
        <Text style={styles.label}>Créée par</Text>
        <Text style={styles.value}>{request.createdByName}</Text>
      </View>
      {user?.role === 'dg' && request.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.btnValidate]} onPress={handleValidate}>
            <Text style={styles.btnText}>Valider</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnRefuse]} onPress={handleRefuse}>
            <Text style={styles.btnText}>Refuser</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, elevation: 1 },
  label: { fontSize: 13, color: '#888', marginTop: 12, fontWeight: '600' },
  value: { fontSize: 16, color: '#333', marginTop: 2 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  btn: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
  btnValidate: { backgroundColor: '#10b981' },
  btnRefuse: { backgroundColor: '#ef4444' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
