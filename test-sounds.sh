#!/bin/bash

# macOS System Sounds Test Script
# Run this script to hear all system sounds with their names

echo "🔊 macOS System Sounds Test"
echo "=========================="
echo "各音を2秒間隔で再生します..."
echo ""

# Define all system sounds
sounds=(
    "Basso"
    "Blow"
    "Bottle"
    "Frog"
    "Funk"
    "Glass"
    "Hero"
    "Morse"
    "Ping"
    "Pop"
    "Purr"
    "Sosumi"
    "Submarine"
    "Tink"
)

# Play each sound with description
for sound in "${sounds[@]}"; do
    echo "▶️  再生中: $sound.aiff"
    play "/System/Library/Sounds/$sound.aiff" vol 0.5
    echo "   完了"
    echo ""
    sleep 2
done

echo "✅ すべての音の再生が完了しました！"