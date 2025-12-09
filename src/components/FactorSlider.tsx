import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';

interface FactorSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: string;
  description?: string;
}

export const FactorSlider: React.FC<FactorSliderProps> = ({
  label,
  value,
  onChange,
  color,
  description,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, {color}]}>{value.toFixed(1)}</Text>
      </View>
      {description && <Text style={styles.description}>{description}</Text>}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10}
        step={0.5}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={color}
        maximumTrackTintColor="#ddd"
        thumbTintColor={color}
      />
      <View style={styles.scaleLabels}>
        <Text style={styles.scaleLabel}>Low (0)</Text>
        <Text style={styles.scaleLabel}>High (10)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  scaleLabel: {
    fontSize: 12,
    color: '#999',
  },
});
