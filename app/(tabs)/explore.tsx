import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, ScrollView } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
      selection={<ThemedText type="subtitle" style={{ padding: 15 }}>Explore</ThemedText>}
    >
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>Réglages</ThemedText>

        <View style={styles.feature}>
          <Ionicons name="aperture" size={24} color="#007bff" style={styles.icon} />
          <View style={styles.textContainer}>
            <ThemedText type="subtitle">Gestion Multi-appareils</ThemedText>
            <ThemedText>Permet la gestion simultanée de plusieurs dispositifs connectés depuis une interface centralisée.</ThemedText>
            <ThemedText>Améliore le contrôle global et l'intégration des appareils.</ThemedText>
          </View>
        </View>

        <View style={styles.feature}>
          <Ionicons name="calendar" size={24} color="#007bff" style={styles.icon} />
          <View style={styles.textContainer}>
            <ThemedText type="subtitle">Planification des Tâches</ThemedText>
            <ThemedText>Programmez des actions spécifiques pour les appareils, comme allumer les lumières à des moments précis.</ThemedText>
            <ThemedText>Optimise l'efficacité énergétique et améliore le confort.</ThemedText>
          </View>
        </View>

        <View style={styles.feature}>
          <Ionicons name="notifications" size={24} color="#007bff" style={styles.icon} />
          <View style={styles.textContainer}>
            <ThemedText type="subtitle">Notification en Temps Réel</ThemedText>
            <ThemedText>Système d'alertes instantanées pour informer des événements ou anomalies.</ThemedText>
            <ThemedText>Assure une surveillance constante et une réactivité accrue.</ThemedText>
          </View>
        </View>

        <View style={styles.feature}>
          <Ionicons name="link" size={24} color="#007bff" style={styles.icon} />
          <View style={styles.textContainer}>
            <ThemedText type="subtitle">Intégration de Services</ThemedText>
            <ThemedText>Intégration avec des services externes de l'assistance vocale.</ThemedText>
            <ThemedText>Enrichit l'expérience utilisateur et permet un contrôle vocal.</ThemedText>
          </View>
        </View>

        <View style={styles.feature}>
          <Ionicons name="analytics" size={24} color="#007bff" style={styles.icon} />
          <View style={styles.textContainer}>
            <ThemedText type="subtitle">Analyse de Données</ThemedText>
            <ThemedText>Collecte et analyse des données d'utilisation pour des rapports personnalisés.</ThemedText>
            <ThemedText>Optimise l'utilisation des appareils et fournit des conseils sur l'efficacité énergétique.</ThemedText>
          </View>
        </View>
      </ThemedView>
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
});
