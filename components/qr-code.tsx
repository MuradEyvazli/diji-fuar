import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface QRCodeProps {
  data: string;
  size?: number;
}

export function QRCode({ data, size = 200 }: QRCodeProps) {
  // Sahte QR kod pattern'i oluştur
  const generateFakeQRPattern = (data: string): boolean[][] => {
    const gridSize = 25; // 25x25 grid
    const pattern: boolean[][] = [];

    // Seed için data string'ini kullan
    let seed = 0;
    for (let i = 0; i < data.length; i++) {
      seed += data.charCodeAt(i);
    }

    // Pseudo-random number generator (determinist)
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    for (let y = 0; y < gridSize; y++) {
      pattern[y] = [];
      for (let x = 0; x < gridSize; x++) {
        // Corner markers (her QR kodun 4 köşesinde olması gereken büyük kareler)
        if (
          (x < 7 && y < 7) || // Sol üst
          (x >= gridSize - 7 && y < 7) || // Sağ üst
          (x < 7 && y >= gridSize - 7) // Sol alt
        ) {
          // Corner marker pattern
          const inBorder = x === 0 || x === 6 || y === 0 || y === 6;
          const inInnerBorder = x === 1 || x === 5 || y === 1 || y === 5;
          const inCenter = x >= 2 && x <= 4 && y >= 2 && y <= 4;

          pattern[y][x] = inBorder || inCenter;
        }
        // Timing patterns (sıra 6'da dikey ve yatay çizgiler)
        else if (x === 6 || y === 6) {
          pattern[y][x] = (x + y) % 2 === 0;
        }
        // Geri kalan alanlar için pseudo-random
        else {
          const randomSeed = seed + x * 13 + y * 17;
          pattern[y][x] = random(randomSeed) > 0.5;
        }
      }
    }

    return pattern;
  };

  const pattern = generateFakeQRPattern(data);
  const cellSize = size / 25;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.qrGrid}>
        {pattern.map((row, y) =>
          row.map((cell, x) => (
            <View
              key={`${x}-${y}`}
              style={[
                styles.qrCell,
                {
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: cell ? '#000000' : '#ffffff',
                }
              ]}
            />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
  },
  qrCell: {
    // Her hücre için style'lar dinamik olarak ayarlanacak
  },
});